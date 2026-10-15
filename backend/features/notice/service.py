from sqlalchemy.orm import Session
from features.notice.schema import NoticeCreate,NoticeUpdate,NoticeResponse,UserResponse
from features.user.models import User
from features.notice.models import Notice
from features.notice.exceptions import UserCredentialException,NoticeNotFoundException

def create_notice(db:Session,data:NoticeCreate,current_user:User):
    notice = Notice(title=data.title,content=data.content,author_id=current_user.id)

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