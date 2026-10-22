from fastapi import APIRouter, HTTPException, status
from fastapi import Depends
from sqlalchemy.orm import Session
from db.database import get_db
from core.dependencies import get_current_user
from features.approval.exceptions import (
    ApprovalNotFoundException,
    ApprovalPermissionException,
    NoDepartmentException,
    InvalidApproverException,
    InvalidStatusException,
    AlreadyCompletedException,
)
from features.approval.schema import (
    ApprovalListItem,
    ApprovalResponse,
    ApprovalCreate,
    ApprovalStatusUpdate,
    UserBrief,
)
from features.approval.services import (
    get_approval_list,
    get_my_drafted_list,
    get_pending_list,
    get_rejected_list,
    get_approver_candidates,
    create_approval,
    get_one_approval,
    change_approval_status,
    remove_approval,
)
from features.user.models import User

approval_router = APIRouter(prefix="/approvals", tags=["approval"])


# 누가 무엇을 보는지는 직급이 아니라 문서의 drafter_id(기안자)·approver_id(결재자)로 정합니다.
# 결재자를 고를 때 직급 규칙(같은 부서 윗사람, 없으면 ADMIN)을 적용하므로
# 사장·팀장은 자기에게 올라온 문서를 "결재 대기"에서 보게 됩니다.

# GET    /approvals/pending    -> 결재 대기 (내가 결재자, IN_PROGRESS)
# GET    /approvals/drafted    -> 내 기안 (내가 기안자, IN_PROGRESS)
# GET    /approvals/approved   -> 승인됨 (내가 기안자나 결재자)
# GET    /approvals/rejected   -> 반려됨 (내가 기안자나 결재자)
# GET    /approvals/approvers  -> 결재자 후보 (기안 화면 select용)
# POST   /approvals            -> 기안하기
# GET    /approvals/{id}       -> 문서 하나 자세히 보기 (기안자·결재자만)
# PUT    /approvals/{id}       -> 승인·반려 (결재자만)
# DELETE /approvals/{id}       -> 삭제 (기안자만, 처리 전 문서만)


@approval_router.get("/pending", response_model=list[ApprovalListItem])
async def get_pending(
    db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    return get_pending_list(db=db, user=user)


@approval_router.get("/drafted", response_model=list[ApprovalListItem])
async def get_my_drafted(
    db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    return get_my_drafted_list(db=db, user=user)


@approval_router.get("/approved", response_model=list[ApprovalListItem])
async def get_approved(
    db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    return get_approval_list(db=db, user=user)


@approval_router.get("/rejected", response_model=list[ApprovalListItem])
async def get_rejected(
    db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    return get_rejected_list(db=db, user=user)


# 결재자 후보 (기안 화면의 결재자 select에 넣을 목록)
@approval_router.get("/approvers", response_model=list[UserBrief])
async def get_approvers(
    db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    try:
        candidates = get_approver_candidates(db=db, user=user)
    except NoDepartmentException:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="부서가 없는 사용자입니다.",
        )
    return candidates


# 기안하기
@approval_router.post("", response_model=dict)
async def post_approval(
    data: ApprovalCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        new_approval = create_approval(db=db, data=data, user=user)
    except NoDepartmentException:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="부서가 없는 사용자입니다.",
        )
    except InvalidApproverException:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="결재자로 지정할 수 없는 사람입니다.",
        )
    return {"message": f"{new_approval.id} 번 문서가 기안되었습니다."}


# 문서 하나 자세히 보기
@approval_router.get("/{id}", response_model=ApprovalResponse)
async def get_approval(
    id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        approval = get_one_approval(db=db, id=id, user=user)
    except ApprovalNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="문서를 찾을 수 없습니다."
        )
    except ApprovalPermissionException:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="볼 수 있는 권한이 없습니다."
        )
    return approval


# 승인·반려
@approval_router.put("/{id}", response_model=dict)
async def update_approval_status(
    id: int,
    data: ApprovalStatusUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        id = change_approval_status(db=db, id=id, data=data, user=user)
    except ApprovalNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="문서를 찾을 수 없습니다."
        )
    except ApprovalPermissionException:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="결재자만 처리할 수 있습니다."
        )
    except AlreadyCompletedException:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="이미 처리된 문서입니다."
        )
    except InvalidStatusException:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="APPROVED 또는 REJECTED만 입력 가능합니다.",
        )
    return {"message": f"{id} 번 문서가 처리되었습니다."}


# 삭제
@approval_router.delete("/{id}", response_model=dict)
async def delete_approval(
    id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        id = remove_approval(db=db, id=id, user=user)
    except ApprovalNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="문서를 찾을 수 없습니다."
        )
    except ApprovalPermissionException:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="기안자만 삭제할 수 있습니다."
        )
    except AlreadyCompletedException:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 처리된 문서는 삭제할 수 없습니다.",
        )
    return {"message": f"{id} 번 문서가 삭제되었습니다."}
