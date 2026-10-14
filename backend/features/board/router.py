from fastapi import APIRouter, HTTPException, status
from features.board.schemas import BoardUpdate, BoardCreate, BoardResponse, BoardPageResponse
from features.board.service import (
    create,
    update,
    delete,
    select_all,
    select_one,
    select_recents,
    update_views,
)
from sqlalchemy.orm import Session
from fastapi import Depends
from db.database import get_db
from features.board.exceptions import BoardNotFoundException
from features.user.dependencies import get_current_user
from features.user.models import User
from features.user.exceptions import UserCredentialsException

board_router = APIRouter(tags=["Boards"])

# 전체 조회 + GET: http://localhost:8000/boards
# 하나 조회 + GET: http://localhost:8000/boards/1
# 하나 수정 + PUT: http://localhost:8000/boards/1 + 수정데이터
# 하나 삭제 + DELETE: http://localhost:8000/boards/1
# 댓글 조회 + http://localhost:8000/boards/1/comments


@board_router.get("", response_model=BoardPageResponse)
async def get_boards(
    db: Session = Depends(get_db),
    page: int = 1,
    size: int = 10,
    criteria: str = "",
    keyword: str = "",
):
    result = select_all(db=db, page=page, size=size, criteria=criteria, keyword=keyword)
    return result


@board_router.post("", response_model=dict)
async def post_board(
    data: BoardCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        board = create(db=db, data=data, currnet_user=current_user)

    except UserCredentialsException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않은 사용자입니다.",
        )
    return {"message": f"{board.id}번이 삽입되었습니다."}


@board_router.get("/recents", response_model=list[BoardResponse])
async def get_recents(db: Session = Depends(get_db)):
    result = select_recents(db=db)
    return result


@board_router.get("/{id}", response_model=BoardResponse)
async def get_board(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        board = select_one(db=db, id=id)
        update_views(board=board, db=db, current_user=current_user)
    except BoardNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="해당 board를 찾을 수 없습니다.",
        )
    return board


@board_router.put("/{id}", response_model=dict)
async def put_board(
    id: int,
    update_board: BoardUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    try:
        id = update(id=id, db=db, data=update_board, current_user=current_user)

    except BoardNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="해당 board를 찾을 수 없습니다.",
        )
    except UserCredentialsException:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="수정 권한이 없습니다."
        )
    return {"message": f"{id}번이 수정되었습니다"}


@board_router.delete("/{id}", response_model=dict)
async def delete_board(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        id = delete(db=db, id=id, current_user=current_user)

    except BoardNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="해당 board를 찾을 수 없습니다.",
        )
    except UserCredentialsException:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="삭제 권한이 없습니다."
        )
    return {"message": f"{id}번이 삭제되었습니다"}


# @board_router.get("/{id}/comments", response_model=list[Comment])
# async def get_board_comments(id: int):
#     return []
