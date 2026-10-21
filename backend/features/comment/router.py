from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db.database import get_db
from features.comment.service import comment_create, comment_update, comment_delete
from features.comment.schemas import CommentCreate, CommentUpdate
from features.board.exceptions import CommentNotFoundException

comment_router = APIRouter(tags=["Comments"])

# 댓글 추가
@comment_router.post("/", response_model=dict)
async def post_comment(data: CommentCreate, db: Session = Depends(get_db)):
    comment = comment_create(data, db=db)
    return {"message": f"comment {comment.id} 번 등록 완료"}

# 댓글 수정
@comment_router.put("/{comment_id}", response_model=dict)
async def put_comment(comment_id: int, data: CommentUpdate, db: Session = Depends(get_db)):
    try:
        id = comment_update(comment_id=comment_id, data=data, db=db)
    except CommentNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="수정 할 comment 가 없습니다."
        )

    return {"message": f"comment {id} 번 수정 완료"}


# 댓글 삭제
@comment_router.delete("/{comment_id}", response_model=dict)
async def delete_comment(comment_id: int, db: Session = Depends(get_db)):
    try:
        id = comment_delete(comment_id=comment_id, db=db)
    except CommentNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="삭제 할 comment 가 없습니다."
        )

    return {"message": f"comment {id} 번 삭제 완료"}