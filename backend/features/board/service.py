from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select
from features.board.models import Board, Board_Views
from features.comment.models import Comment
from features.board.schemas import BoardCreate, BoardUpdate
from features.board.exceptions import BoardNotFoundException, BoardForbiddenException
from features.user.exceptions import UserCredentialsException
from features.user.models import User
import math


def update_views(db: Session, board: Board, current_user: User):
    # Board 테이블의 views + 1 update
    # Board_views 테이블에 insert () => 동일한 값이 존재하는지 확인

    stmt = select(Board_Views).where(
        Board_Views.board_id == board.id, Board_Views.user_id == current_user.user_id
    )
    view = db.scalar(stmt)
    if view is None:
        board.views += 1
        board_view = Board_Views(board_id=board.id, user_id=current_user.user_id)
        db.add(board_view)
        db.commit()


def create(db: Session, data: BoardCreate, currnet_user: User):

    board = Board(
        title=data.title, contents=data.contents, user_id=currnet_user.user_id
    )
    db.add(board)
    db.commit()
    db.refresh(board)
    return board


def update(db: Session, data: BoardUpdate, id: int, current_user: User):
    board = db.get(Board, id)

    if board is None:
        raise BoardNotFoundException

    if board.user_id != current_user.user_id:
        raise UserCredentialsException

    if data.title is not None:
        board.title = data.title
    if data.contents is not None:
        board.contents = data.contents

    db.commit()
    return id


# def select_one(db: Session, id: int):
#     board = db.get(Board, id)
#     if board is None:
#         raise BoardNotFoundException
#     return board


def select_one(db: Session, id: int):

    stmt = (
        select(Board)
        .options(
            selectinload(Board.user),
            selectinload(Board.comments).selectinload(Comment.user),
        )
        .where(Board.id == id)
    )
    board = db.scalar(stmt)

    if board is None:
        raise BoardNotFoundException
    return board


# 전체 조회 + 검색
def select_all(db: Session, page: int, size: int, criteria: str, keyword: str):
    query = db.query(Board)

    if keyword:
        if criteria == "tc":
            query = query.filter(
                Board.title.contains(keyword) | Board.contents.contains(keyword)
            )
        elif criteria == "t":
            query = query.filter(Board.title.contains(keyword))
        elif criteria == "w":
            query = query.join(Board.user).filter(User.name.contains(keyword))

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
        "criteria": criteria,
        "keyword": keyword,
    }


def select_recents(db: Session):
    query = db.query(Board)
    boards = query.order_by(Board.created_at.desc()).limit(4).all()
    return boards


def delete(db: Session, id: int, current_user: User):

    board = db.get(Board, id)

    if board is None:
        raise BoardNotFoundException
    if board.user_id != current_user.user_id:
        raise UserCredentialsException
    db.delete(board)
    db.commit()
    return id
