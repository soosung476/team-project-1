from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select
from features.board.models import BoardPost as Board
from features.comment.models import BoardComment as Comment
from features.board.schemas import BoardCreate, BoardUpdate
from features.board.exceptions import BoardNotFoundException, UserCredentialsException
import math
from features.user.models import User

def select_one(db: Session, id: int):

    stmt = (
        select(Board)
        .options(
            selectinload(Board.author),
            selectinload(Board.comments).selectinload(Comment.author),
        )
        .where(Board.id == id)
    )

    board = db.scalar(stmt)

    if board is None:
        raise BoardNotFoundException

    return board

# 제목, 내용 추가
def create(db: Session, data: BoardCreate, current_user: User):

    board = Board(
        title=data.title, content=data.content, author_id=current_user.id
    )   
    db.add(board)
    db.commit()
    db.refresh(board)
    return board


# 제목, 내용 수정
def update(db: Session, data: BoardUpdate, id: int, current_user: User):

    board = db.get(Board, id)

    if board is None:
        raise BoardNotFoundException

    if board.author_id != current_user.id:
        raise UserCredentialsException

    if data.title is not None:
        board.title = data.title

    if data.content is not None:
        board.content = data.content

    db.commit()
    return id


def recentPosts(db: Session, limit: int = 5 ):

    return db.query(Board).order_by(Board.created_at.desc()).limit(limit).all()

# 전체 조회
def select_all(db: Session, page: int, size: int):

    query = db.query(Board)

    total = query.count()
    offset = (page - 1) * size
    boards = query.order_by(Board.id.desc()).offset(offset).limit(size).all()
    total_pages = math.ceil(total / size)

    return {
        "items": boards,
        "total": total,
        "page": page,
        "size": size,
        "total_pages": total_pages,
    }

# 삭제
def delete(db: Session, id: int, current_user: User):

    board = db.get(Board, id)

    if board is None:
        raise BoardNotFoundException

    if board.author_id != current_user.id:
        raise UserCredentialsException

    db.delete(board)
    db.commit()
    return id
