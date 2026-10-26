from fastapi import APIRouter, HTTPException, status , Depends
from features.user.models import User
from features.notice.service import create_notice,update_notice,remove_notice,get_one_notice,get_all_notices
from sqlalchemy.orm import Session
from db.database import get_db
from core.dependencies import get_current_user,get_admin_user,get_user
from features.notice.schema import NoticeCreate, NoticeResponse,NoticeUpdate,NoticeListResponse,UserResponse
from features.notice.exceptions import NotMatchedPinnedException, NoticeNotFoundException, UserCredentialException

notice_router = APIRouter(prefix="/notice" , tags=["Notices"])

@notice_router.post("",response_model=dict)
async def post_notice(
    data:NoticeCreate,
    db:Session = Depends(get_db),
    # get_admin_user 에서 알아서 403 출력
    current_user:User=Depends(get_admin_user)
):
    try:
        new_notice = create_notice(db=db,data=data,current_user=current_user)
    except NotMatchedPinnedException:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,detail=" Y 또는 N 만 입력 가능합니다."
        )
    
    return {"message":f"{new_notice.id} 번이 생성되었습니다."}  

@notice_router.put("/{id}",response_model=dict)
async def put_notice(
    id:int,
    data:NoticeUpdate,
    db:Session = Depends(get_db),
    current_user:User=Depends(get_admin_user)
):
    try:
        id = update_notice(db=db,data=data,current_user=current_user,id=id)
    # service 에 작성한 exception 오류 잡아주기
    except NoticeNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,detail="공지사항을 찾을 수 없습니다."
        )
    except NotMatchedPinnedException:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,detail=" Y 또는 N 만 입력 가능합니다."
        )
    return {"message":f"{id}번이 수정되었습니다."} 

@notice_router.delete("/{id}",response_model=dict)
async def delete_notice(
    id:int,
    db:Session = Depends(get_db),
    # 관리자 권한 확인용 호출
    current_user:User=Depends(get_admin_user)
):
    try:
        id=remove_notice(id=id,db=db)
    except NoticeNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,detail="공지사항을 찾을 수 없습니다."
        )
    return {"message":f"{id}번이 삭제되었습니다."}

@notice_router.get("",response_model=NoticeListResponse)
async def get_notices(page:int=1,size:int=10,
    db:Session = Depends(get_db)):

    try:
        result = get_all_notices(page=page,size=size,db=db)
    except NoticeNotFoundException:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="공지사항을 찾을 수 없습니다.")
    return result

@notice_router.get("/{id}",response_model=NoticeResponse)
async def get_notice(id:int,current_user:User=Depends(get_current_user),db:Session = Depends(get_db)):
    try:
        result = get_one_notice(id=id,db=db)
    except NoticeNotFoundException:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="공지사항을 찾을 수 없습니다.")

    return result