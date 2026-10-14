# 모든 모델을 여기서 한 번에 import 합니다.
# relationship("User")처럼 다른 모델을 이름으로 찾으려면 그 모델이 먼저 import 되어 있어야 하고,
# Alembic autogenerate도 import 된 모델만 테이블로 인식합니다.
from features.department.models import Department
from features.user.models import User
from features.approval.models import ApprovalDocument
from features.room.models import MeetingRoom, Reservation
from features.notice.models import Notice
from features.board.models import BoardPost
from features.comment.models import BoardComment

__all__ = [
    "Department",
    "User",
    "ApprovalDocument",
    "MeetingRoom",
    "Reservation",
    "Notice",
    "BoardPost",
    "BoardComment",
]
