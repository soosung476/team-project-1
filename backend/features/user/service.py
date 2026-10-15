from sqlalchemy.orm import Session
from features.user.models import User
from features.user.exceptions import UserNotFoundException


def get_user(db: Session, user_id: int) -> User:
    user = db.get(User, user_id)
    if user is None:
        raise UserNotFoundException

    return user
