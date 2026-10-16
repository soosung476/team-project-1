from fastapi import APIRouter, HTTPException, status
from fastapi import Depends
from sqlalchemy.orm import Session
from db.database import get_db
from core.dependencies import get_current_user
from features.approval.models import ApprovalDocument
from features.approval.exceptions import TestException
from features.approval.services import (
    get_approval_list,
    get_my_drafted_list,
    get_pending_list,
    get_rejected_list,
)
from features.user.models import User

approval_router = APIRouter(prefix="/approvals", tags=["approval"])


# 자 기능을 생각해보자.
# approval 페이지에서 일단 보여줄 것이 뭐가 있어?


# 애초에 들어가는 순간에 권한부터 확인해야겠지?  => 유저가 필요하지 => current_user를 가져와야해.
# 그럼 유저 권한에 따라서 어떤걸 보여줄꺼냐? -> 우리는 애초에 사원 팀장 사장 이 세단계 구분이야.
# 사장 => 자신, 팀장과 사원의 draft 문서를 보여주면 돼.
# 팀장 => 자신과 사원의 draft 문서를 보여주면 돼.
# 사원 => 자기 자신의 draft 문서를 보여주면 돼.

# 그럼 일단 get 매소드가 몇개 있어야 겠지??
# 자 get_drafted_list 하면 이제 승인 이전, IN-PROGRESS인 데이터를 가져오면 되겠지?
# get_approved_list 하면 이제 승인 완료된 데이터를 가져오면 되고
# get_rejected_list 하면 이제 반려된 데이터를 가져오면 됨

# 조회창에 그러면 3개가 나란히 조회돼야 한다.
# GET: 8000/approvals -> 3가지 나눠서 쏴주기 -> /pending, /drafted, /approved
# POST: 8000/approvals -> 제안서 내기.
# GET: 8000/approvals/1 -> 해당 제안서 자세히 보기
# PUT: 8000/approvals/1 -> 해당 제안서의 상태 수정 (반려, 승인)
# DELETE: 8000/approvals/1 -> 해당 제안서 삭제, 폐기


@approval_router.get("/pending")
async def get_pending(
    db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    try:
        pending_list = get_pending_list(db=db, user=user)

    except TestException:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    return pending_list


@approval_router.get("/drafted")
async def get_my_drafted(
    db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    try:
        my_drafted_list = get_my_drafted_list(db=db, user=user)
    except TestException:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return my_drafted_list


@approval_router.get("/approved")
async def get_approved_list(
    db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    try:
        approved_list = get_approval_list(db=db, user=user)
    except TestException:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return approved_list


@approval_router.get("/rejected")
async def get_rejected_list(
    db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    try:
        rejected_list = get_rejected_list(db=db, user=user)
    except TestException:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)


# 제안서 내기


@approval_router.post("")
async def post_approval(
    db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    pass


# 제안서 하나 조회
@approval_router.get("/{id}")
async def get_approval(id: int, db: Session = Depends(get_db)):
    pass


# 제안서
@approval_router.put("/{id}")
async def update_approval_status(id: int, db: Session = Depends(get_db)):
    pass


@approval_router.delete("/{id}")
async def delete_approval(id: int, db: Session = Depends(get_db)):
    pass
