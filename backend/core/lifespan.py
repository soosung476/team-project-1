from contextlib import asynccontextmanager
from fastapi import FastAPI


async def lifespan(app: FastAPI):
    """애플리케이션 전체의 시작과 종료 관리"""
    print("서버시작")

    # 데이터베이스 초기화
    # init_db()
    # LLM 초기화
    # 벡터DB 초기화

    yield

    print("서버 종료")
