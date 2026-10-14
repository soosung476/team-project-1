# 데이터베이스 연결 설정
from sqlalchemy import create_engine, URL
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from core.config import settings

database_url = URL.create(
    drivername="oracle+oracledb",
    username=settings.oracle_user,
    password=settings.oracle_password,
    host="localhost",
    port=1522,  # 클라우드 DB로 가는 SSH 터널 포트 (ssh -L 1522:127.0.0.1:1521 ...)
    query={"service_name": settings.oracle_dsn},
)

engine = create_engine(database_url, echo=True)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


# def init_db():
#     from features.board.models import Board
#     from features.user.models import User
#     from features.comment.models import Comment

#     # Base.metadata에 등록된 테이블 생성 (없을때만)
#     # 컬럼 수정 반영 못해줌 => 다른 도구 필요
#     Base.metadata.create_all(bind=engine)
#     print("테이블 초기화 완료")


# API 요청 하나에서 사용할 DB session 만들어주고 요청이 완료되면 닫기
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
