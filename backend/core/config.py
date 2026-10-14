# 프로젝트 환경설정 파일
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

ENV_FILE = Path(__file__).resolve().parent.parent / ".env"


class Settings(BaseSettings):
    # 실행 위치(cwd)와 상관없이 simple_board/.env 를 읽도록 절대경로 사용
    model_config = SettingsConfigDict(env_file=ENV_FILE, extra="ignore")
    oracle_user: str = Field(alias="ORACLE_USER")
    oracle_password: str = Field(alias="ORACLE_PASSWORD")
    oracle_dsn: str = Field(alias="ORACLE_DSN")
    secret_key: str = Field(alias="SECRET_KEY")
    jwt_algorithm: str = "HS256"
    access_token_expire_seconds: int = 3600


settings = Settings()
