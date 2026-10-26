from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select
from features.notice.schema import NoticeCreate,NoticeUpdate,NoticeResponse,UserResponse,NoticeListResponse
from features.user.models import User
from features.notice.models import Notice
from features.notice.exceptions import UserCredentialException,NoticeNotFoundException,NotMatchedPinnedException
import math

def create_notice(db:Session,data:NoticeCreate,current_user:User):
    notice = Notice(title=data.title,content=data.content,is_pinned=data.is_pinned,author_id=current_user.id)

    if data.is_pinned is not None:
        if data.is_pinned == "Y" or data.is_pinned == "N":
            notice.is_pinned = data.is_pinned
        else: 
            raise NotMatchedPinnedException

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


def get_all_notices(db:Session,page:int,size:int):
    notice = db.query(Notice)

    if notice is None:
        raise NoticeNotFoundException

    offset = (page - 1) * size
    # 고정글
    pinned_notices = notice.filter(Notice.is_pinned == "Y").order_by(Notice.id.desc()).all()
    # 일반글
    not_pinned = notice.filter(Notice.is_pinned == "N")
    # 일반글, 고정글 수와 총 합
    not_pinned_total = not_pinned.count()
    pinned_total = notice.filter(Notice.is_pinned == "Y").count()
    notices_total = not_pinned_total+pinned_total
    # 일반글 기준 페이지 나누기
    not_pinned_notices = not_pinned.order_by(Notice.id.desc()).offset(offset).limit(size).all()
    total_pages = math.ceil(not_pinned_total/size)
    # 고정글 + 일반글
    total_notices = pinned_notices + not_pinned_notices

    return{
    "items": total_notices,
    "total":notices_total,
    "page":page,
    "size":size,
    "total_pages":total_pages}




def get_one_notice(db:Session,id:int):
    stmt = select(Notice).options(selectinload(Notice.author)).where(Notice.id == id)

    notice = db.scalar(stmt)

    if notice is None:
        raise NoticeNotFoundException

    return notice
