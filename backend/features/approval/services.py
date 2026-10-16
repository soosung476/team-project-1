from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select, or_
from features.approval.models import ApprovalDocument
from features.user.models import User
from features.approval.exceptions import TestException


def get_pending_list(db: Session, user: User):
    stmt = select(ApprovalDocument).where(
        ApprovalDocument.approver_id == user.id,
        ApprovalDocument.status == "IN_PROGRESS",
    )
    pending_list = db.scalar(stmt)

    return pending_list


def get_my_drafted_list(db: Session, user: User):
    stmt = select(ApprovalDocument).where(
        ApprovalDocument.drafter_id == user.id, ApprovalDocument.status == "IN_PROGRESS"
    )
    my_drafted_list = db.scalar(stmt)
    return my_drafted_list


def get_approval_list(db: Session, user: User):
    stmt = select(ApprovalDocument).where(
        or_(
            ApprovalDocument.drafter_id == user.id,
            ApprovalDocument.approver_id == user.id,
        ),
        ApprovalDocument.status == "APPROVED",
    )

    approval_list = db.scalar(stmt)
    return approval_list


def get_rejected_list(db: Session, user: User):
    stmt = select(ApprovalDocument).where(
        or_(
            ApprovalDocument.drafter_id == user.id,
            ApprovalDocument.approver_id == user.id,
        )
        and ApprovalDocument.status == "REJECTED"
    )

    rejected_list = db.scalar(stmt)
    return rejected_list
