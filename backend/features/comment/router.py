from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db.database import get_db
from features.comment.service import comment_create, comment_delete, comment_update
from features.comment.schemas import CommentCreate, CommentUpdate
from features.board.exceptions import CommentNotFoundException

comment_router = APIRouter(tags=["Comments"])


@comment_router.post("", response_model=dict)
async def post_commnet(data: CommentCreate, db: Session = Depends(get_db)):
    comment = comment_create(data=data, db=db)
    return {"message": f"comment {comment.comment_id}번 등록 성공"}


@comment_router.put("/{comment_id}", response_model=dict)
async def put_comment(
    comment_id: int, data: CommentUpdate, db: Session = Depends(get_db)
):
    try:
        id = comment_update(comment_id=comment_id, db=db, data=data)
    except CommentNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="해당 Comment가 존재하지 않습니다..",
        )

    return {"message": f"{id}번 수정 완료."}


@comment_router.delete("/{comment_id}", response_model=dict)
async def delete_comment(comment_id: int, db: Session = Depends(get_db)):
    try:
        comment_delete(comment_id=comment_id, db=db)

    except CommentNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="삭제할 Comment가 없습니다."
        )

    return {"message": f"{comment_id}번 삭제 완료."}
