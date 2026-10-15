from sqlalchemy.orm import Session
from schema import NoticeCreate,NoticeUpdate,NoticeResponse,UserResponse
from user.models import User
from models import Notice

def create_notice(db:Session,data:NoticeCreate,current_user:User):
    notice = Notice(db=db,data=data,current_user=current_user)

    db.add(notice)
    db.commit()
    db.refresh(notice)

    return notice

def update_notice():
    pass

def delete_notice():
    pass

def get_notices():
    pass

def get_notice():
    pass