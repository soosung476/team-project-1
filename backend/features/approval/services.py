from datetime import datetime
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select, or_, func
import math
from core.positions import POSITION_LEVEL
from features.approval.models import ApprovalDocument
from features.approval.schema import ApprovalCreate, ApprovalStatusUpdate
from features.user.models import User
from features.approval.exceptions import (
    ApprovalNotFoundException,
    ApprovalPermissionException,
    NoDepartmentException,
    InvalidApproverException,
    InvalidStatusException,
    AlreadyCompletedException,
)


# approval page에서 검색기능을 위해 만든 새로운 함수.
def get_approval_page(
    db: Session, conditions, order, page: int, size: int, criteria: str, keyword: str
):

    # keyword 에 title, drafter, approver를 검색 기준으로 세울 수 있다.
    # title은 제목, drafter는 기안자, approver는 결제자.

    if keyword:
        if criteria == "title":
            conditions.append(ApprovalDocument.title.contains(keyword))
        elif criteria == "drafter":
            conditions.append(ApprovalDocument.drafter.has(User.name.contains(keyword)))
        elif criteria == "approver":
            conditions.append(
                ApprovalDocument.approver.has(User.name.contains(keyword))
            )


    # keyword에 따라서 condition이 달라지고 해당 컨디션의 count를 조회해 total에 넣음.
    # offset은 데이터를 조회할 때 앞에서부터 건너뛸 데이터의 개수. page-1 * size 현재페이지-1의 사이즈를 곱하면 됨.
    offset = (page - 1) * size
    total = db.scalar(
        select(func.count()).select_from(ApprovalDocument).where(*conditions)
    )
    total_pages = math.ceil(total / size)
    stmt = (
        select(ApprovalDocument)
        .options(
            selectinload(ApprovalDocument.drafter),
            selectinload(ApprovalDocument.approver),
        )
        .where(*conditions)
        .order_by(*order)
        .offset(offset)
        .limit(size)
    )
    total_list = db.scalars(stmt).all()
    return {
        "items": total_list,
        "page": page,
        "total": total,
        "size": size,
        "total_pages": total_pages,
    }


# 결재 대기: 내가 결재자이고 아직 처리 안 한 문서
def get_pending_list(
    db: Session, user: User, page: int, size: int, criteria: str, keyword: str
):
    conditions = [
        ApprovalDocument.approver_id == user.id,
        ApprovalDocument.status == "IN_PROGRESS",
    ]
    order = [ApprovalDocument.id.desc()]

    result_page = get_approval_page(
        db=db,
        page=page,
        size=size,
        criteria=criteria,
        keyword=keyword,
        conditions=conditions,
        order=order,
    )
    return result_page


# 내 기안: 내가 올렸고 아직 처리 안 된 문서
def get_my_drafted_list(
    db: Session, user: User, page: int, size: int, criteria: str, keyword: str
):

    conditions = [
        ApprovalDocument.drafter_id == user.id,
        ApprovalDocument.status == "IN_PROGRESS",
    ]
    order = [ApprovalDocument.id.desc()]

    result_page = get_approval_page(
        db=db,
        page=page,
        size=size,
        criteria=criteria,
        keyword=keyword,
        conditions=conditions,
        order=order,
    )

    return result_page


# 승인됨: 내가 기안자이거나 결재자인 문서 중 승인된 것
def get_approval_list(
    db: Session, user: User, page: int, size: int, criteria: str, keyword: str
):

    conditions = [
        or_(
            ApprovalDocument.drafter_id == user.id,
            ApprovalDocument.approver_id == user.id,
        ),
        ApprovalDocument.status == "APPROVED",
    ]

    order = [ApprovalDocument.completed_at.desc(), ApprovalDocument.id.desc()]
    result_page = get_approval_page(
        db=db,
        page=page,
        size=size,
        criteria=criteria,
        keyword=keyword,
        conditions=conditions,
        order=order,
    )

    return result_page


# 반려됨: 내가 기안자이거나 결재자인 문서 중 반려된 것
def get_rejected_list(
    db: Session, user: User, page: int, size: int, criteria: str, keyword: str
):

    conditions = [
        or_(
            ApprovalDocument.drafter_id == user.id,
            ApprovalDocument.approver_id == user.id,
        ),
        ApprovalDocument.status == "REJECTED",
    ]

    order = [ApprovalDocument.completed_at.desc(), ApprovalDocument.id.desc()]

    result_page = get_approval_page(
        db=db,
        page=page,
        size=size,
        criteria=criteria,
        keyword=keyword,
        conditions=conditions,
        order=order,
    )
    return result_page


# ---------- 결재자 후보 ----------
# 같은 부서에서 나보다 직급이 높은 사람. 없으면 ADMIN(나 빼고).
def get_approver_candidates(db: Session, user: User):
    # 부서가 없으면 기안 자체를 못 합니다.
    if user.department_id is None:
        raise NoDepartmentException

    my_level = POSITION_LEVEL.get(user.position, 0)

    same_department_users = db.scalars(
        select(User).where(
            User.department_id == user.department_id,
            User.id != user.id,
        )
    ).all()

    candidates = []
    for u in same_department_users:
        if POSITION_LEVEL.get(u.position, 0) > my_level:
            candidates.append(u)

    # 같은 부서에 윗사람이 없으면(예: 사장) 관리자에게 올립니다.
    if not candidates:
        candidates = db.scalars(
            select(User).where(User.role == "ADMIN", User.id != user.id)
        ).all()

    return candidates


# ---------- 기안하기 ----------
def create_approval(db: Session, data: ApprovalCreate, user: User):
    # 화면에서 고른 결재자가 정말 후보인지 서버에서도 다시 확인합니다.
    candidates = get_approver_candidates(db=db, user=user)
    candidate_ids = [c.id for c in candidates]
    if data.approver_id not in candidate_ids:
        raise InvalidApproverException

    approval = ApprovalDocument(
        drafter_id=user.id,
        approver_id=data.approver_id,
        title=data.title,
        content=data.content,
    )

    db.add(approval)
    db.commit()
    db.refresh(approval)

    return approval


# ---------- 문서 하나 보기 ----------
def get_one_approval(db: Session, id: int, user: User):
    stmt = (
        select(ApprovalDocument)
        .options(
            selectinload(ApprovalDocument.drafter),
            selectinload(ApprovalDocument.approver),
        )
        .where(ApprovalDocument.id == id)
    )
    approval = db.scalar(stmt)

    if approval is None:
        raise ApprovalNotFoundException

    # 기안자와 결재자만 볼 수 있습니다.
    if user.id != approval.drafter_id and user.id != approval.approver_id:
        raise ApprovalPermissionException

    return approval


# ---------- 승인·반려 ----------
def change_approval_status(
    db: Session, id: int, data: ApprovalStatusUpdate, user: User
):
    approval = db.get(ApprovalDocument, id)

    if approval is None:
        raise ApprovalNotFoundException

    # 결재자만 승인·반려할 수 있습니다.
    if user.id != approval.approver_id:
        raise ApprovalPermissionException

    # 이미 끝난 문서는 다시 처리하지 않습니다.
    if approval.status != "IN_PROGRESS":
        raise AlreadyCompletedException

    if data.status != "APPROVED" and data.status != "REJECTED":
        raise InvalidStatusException

    approval.status = data.status
    approval.completed_at = datetime.now()

    db.commit()
    return id


# ---------- 삭제 ----------
def remove_approval(db: Session, id: int, user: User):
    approval = db.get(ApprovalDocument, id)

    if approval is None:
        raise ApprovalNotFoundException

    # 기안자만 지울 수 있습니다.
    if user.id != approval.drafter_id:
        raise ApprovalPermissionException

    # 승인·반려가 끝난 문서는 기록으로 남깁니다.
    if approval.status != "IN_PROGRESS":
        raise AlreadyCompletedException

    db.delete(approval)
    db.commit()
    return id
