# 문서가 없을 때 -> 404
class ApprovalNotFoundException(Exception):
    pass


# 기안자·결재자가 아닌 사람이 보거나 고치려 할 때 -> 403
class ApprovalPermissionException(Exception):
    pass


# 부서가 없는 사람이 기안하려 할 때 -> 400
class NoDepartmentException(Exception):
    pass


# 결재자 후보가 아닌 사람을 결재자로 고를 때 -> 400
class InvalidApproverException(Exception):
    pass


# status에 APPROVED, REJECTED 말고 다른 값이 올 때 -> 400
class InvalidStatusException(Exception):
    pass


# 이미 승인·반려가 끝난 문서를 다시 처리하거나 지우려 할 때 -> 400
class AlreadyCompletedException(Exception):
    pass
