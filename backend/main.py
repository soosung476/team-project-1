from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.lifespan import lifespan
from features.user.router import user_router
from features.notice.router import notice_router
from features.room.router import router as room_router
from features.board.router import board_router
from features.approval.router import approval_router
import db.models  # noqa: F401  (모든 모델 등록: relationship이 이름으로 다른 모델을 찾음)

app = FastAPI(lifespan=lifespan, title="팀웍스 API", version="1.0.0")


# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,  # 쿠키나 인증정보를 포함한 요청을 허용할 것인가
    allow_methods=["*"],  # 어떤 메소드를 허용할 것인가? (post, get, put, patch, delete)
    allow_headers=["*"],  # 요청에서 사용할 수 있는 헤더정보
)

# 라우터 설정 - 기능을 만들 때마다 여기에 include_router 추가
app.include_router(user_router)
app.include_router(notice_router)
app.include_router(room_router)
app.include_router(board_router)
app.include_router(approval_router)
