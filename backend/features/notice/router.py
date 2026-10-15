from fastapi import APIRouter, HTTPException, status , Depends
from user.models import User
from service import create_notice
from sqlalchemy.orm import Session
from db.database import get_db
from exceptions import UserCredentialException

notice_router = APIRouter.get(tags=["Notices"])

# 로그인 기능 추가 시 role에 따른 생성제한 추가
@notice_router.post("",response_model=create_notice)
async def post_notice(
    data:create_notice,
    db:Session = Depends(get_db),
    current_user:User=Depends()
):
    if current_user.role != 'ADMIN':
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않은 사용자입니다."
        )

    try:
        new_notice = create_notice(db=db,data=data,current_user=current_user)
    except UserCredentialException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="유효하지 않은 사용자입니다.")
    
    return {"message":f"{new_notice.id} 번이 생성되었습니다."}  

# @notice_router.get
# @notice_router.delete
# @notice_router.put
