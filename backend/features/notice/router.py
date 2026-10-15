from fastapi import APIRouter, HTTPException, status , Depends
from features.user.models import User
from features.notice.service import create_notice
from sqlalchemy.orm import Session
from db.database import get_db
from core.dependencies import get_current_user,get_admin_user,get_db,get_user
from features.notice.schema import NoticeCreate

notice_router = APIRouter(prefix="/notice" , tags=["Notices"])

@notice_router.post("",response_model=dict)
async def post_notice(
    data:NoticeCreate,
    db:Session = Depends(get_db),
    current_user:User=Depends(get_admin_user)
):

    new_notice = create_notice(db=db,data=data,current_user=current_user)
    
    return {"message":f"{new_notice.id} 번이 생성되었습니다."}  

# @notice_router.get
# @notice_router.delete
# @notice_router.put
