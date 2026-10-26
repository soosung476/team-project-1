class BoardNotFoundException(Exception):
    pass


class CommentNotFoundException(Exception):
    pass

class UserNotFoundException(Exception):
    pass


class UserAlreadyExistsException(Exception):
    pass


class InvalidPasswordException(Exception):
    pass


class SamePasswordException(Exception):
    pass


class UserCredentialsException(Exception):
    pass

class PermissionDeniedError(Exception):
    pass