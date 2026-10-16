from fastapi import APIRouter, HTTPException, status
from features.board.schemas import BoardResponse, BoardCreate, BoardUpdate, BoardPageResponse
# from features.board.services import create, update, select_all, select_one, delete, recentPosts
from fastapi import Depends
from sqlalchemy.orm import Session
from db.database import get_db
from features.board.exceptions import BoardNotFoundException, UserCredentialsException
from features.user.models import User
from core.dependencies import get_current_user

board_router = APIRouter(prefix="/board", tags=["Boards"])

# 추가
@board_router.post("", response_model=dict)
async def post_board(
    data: BoardCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_board = create(db=db, data=data, current_user=current_user)


    return {"message": f"{new_board.id} 번이 추가되었습니다."}

# 최신글 조회
@board_router.get("/recents", response_model=list[BoardResponse])
async def get_board_recents(db: Session = Depends(get_db)):
    return recentPosts(db=db)

# 전체 조회
@board_router.get("", response_model=BoardPageResponse)
async def get_boards(db: Session = Depends(get_db), page: int = 1, size: int = 10):

    result = select_all(db=db, page=page, size=size)

    return result

@board_router.get("/{id}", response_model=BoardResponse)
async def get_board(
    id: int,
    db: Session = Depends(get_db),
    current_id: User = Depends(get_current_user),
):
    try:
        board = select_one(db=db, id=id)
    except BoardNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="찾는 board가 없습니다."
        )
    return board

# 수정
@board_router.put("/{id}", response_model=dict)
async def put_board(
    id: int,
    update_board: BoardUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        id = update(db=db, id=id, data=update_board, current_user=current_user)
    except BoardNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="찾는 board가 없습니다."
        )
    except UserCredentialsException:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="수정 권한이 없습니다."
        )
        
    return {"message": f"{id} 번이 수정되었습니다."} 

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
            status_code=status.HTTP_404_NOT_FOUND, detail="찾는 board가 없습니다."
        )
    except UserCredentialsException:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="삭제 권한이 없습니다"
        )
    
    return {"message": f"{id} 번이 삭제 되었습니다"}