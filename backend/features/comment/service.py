from sqlalchemy.orm import Session
from features.comment.schemas import CommentCreate, CommentUpdate
from features.comment.models import Comment
from features.board.exceptions import CommentNotFoundException
from features.user.exceptions import UserCredentialsException


def comment_create(data: CommentCreate, db: Session):
    comment = Comment(body=data.body, user_id=data.user_id, board_id=data.board_id)

    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment


def comment_update(comment_id: int, data: CommentUpdate, db: Session):
    comment = db.get(Comment, comment_id)

    if comment is None:
        raise CommentNotFoundException

    if data.body is not None:
        comment.body = data.body

    db.commit()
    return comment_id


def comment_delete(comment_id: int, db: Session):
    comment = db.get(Comment, comment_id)

    if comment is None:
        raise CommentNotFoundException

    db.delete(comment)
    db.commit()
