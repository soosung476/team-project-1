from sqlalchemy.orm import Session
from features.comment.schemas import CommentCreate, CommentUpdate
from features.comment.models import BoardComment
from features.board.exceptions import CommentNotFoundException
from features.board.exceptions import CommentNotFoundException, UserCredentialsException
from features.user.models import User

# 댓글 추가
# 댓글 추가
def comment_create(data: CommentCreate, post_id: int, author_id: int, db: Session):
    comment = BoardComment(
        content=data.content,
        author_id=author_id,
        post_id=post_id,
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment

# 댓글 수정
def comment_update(comment_id: int, data: CommentUpdate, db: Session, current_user: User):

    comment = db.get(BoardComment, comment_id)

    if comment  is None:
        raise CommentNotFoundException

    if comment.author_id != current_user.id and current_user.role != "ADMIN":
        raise UserCredentialsException

    if data.content is not None:
        comment.content = data.content

    db.commit()
    return comment_id

# 댓글 삭제
def comment_delete(comment_id: int, db: Session, current_user: User):

    comment = db.get(BoardComment, comment_id)

    if comment is None:
        raise CommentNotFoundException

    if comment.author_id != current_user.id and current_user.role != "ADMIN":
        raise UserCredentialsException

    db.delete(comment)
    db.commit()

    return comment_id