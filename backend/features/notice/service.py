from sqlalchemy.orm import Session
from features.notice.schema import NoticeCreate,NoticeUpdate,NoticeResponse,UserResponse
from features.user.models import User
from features.notice.models import Notice
from features.notice.exceptions import UserCredentialException,NoticeNotFoundException,NotMatchedPinnedException

def create_notice(db:Session,data:NoticeCreate,current_user:User):
    notice = Notice(title=data.title,content=data.content,author_id=current_user.id)

    db.add(notice)
    db.commit()
    db.refresh(notice)

    return notice

def update_notice(db:Session,data:NoticeUpdate,current_user:User,id:int):
    notice = db.get(Notice, id)

    # 공지사항 없을때
    if notice is None:
        raise NoticeNotFoundException

    # 일부 내용만 수정할 때(수정할 내용이 있다면)
    if data.title is not None:
        notice.title = data.title
    if data.content is not None:
        notice.content = data.content
    if data.is_pinned is not None:
        # Y 또는 N만 받기
        if data.is_pinned == "Y" or data.is_pinned == "N": 
            notice.is_pinned = data.is_pinned
        else: 
            raise NotMatchedPinnedException
            
    db.commit()
    return id
    
def remove_notice(db:Session,id:int):
    notice = db.get(Notice, id)

    if notice is None:
        raise NoticeNotFoundException

    db.delete(notice)
    db.commit()
    return id


def get_notices():
    pass

def get_notice():
    pass