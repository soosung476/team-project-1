# role이 USER·ADMIN이 아님
class InvalidRoleException(Exception):
    pass


# 직급이 사원·팀장·사장이 아님 (core/positions.py POSITION_LEVEL)
class InvalidPositionException(Exception):
    pass


# 관리자가 자기 권한을 바꾸려 함
class SelfRoleChangeException(Exception):
    pass
