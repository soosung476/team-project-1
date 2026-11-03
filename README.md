# 팀웍스 (TeamWorks)

사내 업무를 한곳에서 처리하는 **웹 그룹웨어**입니다.
공지사항, 전자결재, 회의실 예약, 자유게시판을 제공하고, 관리자는 사용자·부서·회의실 예약을 관리할 수 있습니다.

- 백엔드: FastAPI + SQLAlchemy + Oracle DB
- 프론트엔드: React + TypeScript + Vite + Tailwind CSS

<br>

## 목차

1. [주요 기능](#주요-기능)
2. [기술 스택](#기술-스택)
3. [프로젝트 구조](#프로젝트-구조)
4. [시작하기](#시작하기)
5. [API 개요](#api-개요)
6. [데이터베이스](#데이터베이스)
7. [협업 규칙](#협업-규칙)
8. [팀원](#팀원)

<br>

## 주요 기능

### 홈 대시보드
- 로그인한 사용자의 **결재 대기 문서**와 **내 기안 건수**, **필독 공지**를 한 화면에서 확인합니다.

### 회원 / 인증
- 이메일·비밀번호로 회원가입과 로그인을 합니다.
- 비밀번호 규칙: 8~64자, 대문자·소문자·숫자·특수문자(`!@#$%^&*`)를 각각 1자 이상 포함
- JWT 인증
  - Access Token(기본 30분)과 Refresh Token(기본 2시간)을 발급합니다.
  - API가 401을 돌려주면 프론트엔드가 Refresh Token으로 토큰을 다시 받아 원래 요청을 재시도합니다. 재발급도 실패하면 로그인 화면으로 이동합니다.

### 공지사항
- 로그인한 사용자는 누구나 목록·상세를 볼 수 있고, **작성·수정·삭제는 관리자만** 할 수 있습니다.
- **상단 고정** 기능: 고정한 공지는 목록 맨 위에 항상 표시됩니다.
- 조회수 집계, 페이지네이션

### 전자결재
- **기안 작성**: 결재자를 골라 문서를 올립니다.
  - 결재자 후보는 *같은 부서에서 나보다 직급이 높은 사람*입니다. (직급: 사원 < 팀장 < 사장)
  - 같은 부서에 윗사람이 없으면 관리자에게 결재를 올립니다.
  - 부서가 배정되지 않은 사용자는 기안할 수 없습니다.
- **문서함**: 결재 대기 / 내 기안 / 승인됨 / 반려됨
- **승인·반려**는 지정된 결재자만, **삭제**는 기안자만 처리 전 문서에 한해 할 수 있습니다.
- 기안자는 반려된 문서의 기존 내용을 불러와 **재작성**할 수 있습니다.
- 제목·기안자·결재자 기준 검색, 페이지네이션

### 회의실 예약
- 회의실과 날짜를 고르면 **30분 단위 시간 칸**으로 예약 현황을 보여 줍니다.
- 예약 규칙
  - 운영 시간 08:00 ~ 20:00, 30분 단위
  - 시작과 종료는 같은 날짜, 지난 시간은 예약 불가
  - 오늘부터 **1년 뒤까지** 예약 가능
  - 다른 예약과 시간이 겹치면 예약 불가
- **내 예약 / 전체 예약** 토글, 본인 예약 취소

### 자유게시판
- 글 작성·수정·삭제, 조회수, 페이지네이션
- 제목+내용 / 제목 / 작성자 기준 검색
- **댓글** 작성·수정·삭제 (게시글을 지우면 댓글도 함께 삭제)
- 글과 댓글은 작성자 본인과 관리자가 수정·삭제할 수 있습니다.

### 관리자
관리자(`ADMIN`) 계정으로 로그인하면 사이드바에 관리자 메뉴가 나타납니다.
- **사용자 관리**: 사용자 검색, 권한(USER/ADMIN)·직급·부서 변경 (관리자 본인의 권한은 바꿀 수 없음)
- **부서 관리**: 부서 추가·수정·삭제 (소속 사원이 있는 부서는 삭제 불가)
- **회의실 관리**: 전체 예약 조회와 예약 강제 취소

<br>

## 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| Backend | Python 3.14, FastAPI, SQLAlchemy 2.1, Alembic, Pydantic Settings |
| 인증 | PyJWT, pwdlib (Argon2 비밀번호 해시) |
| Database | Oracle Database (`oracledb` 드라이버) |
| Frontend | React 19, TypeScript, Vite, React Router, Axios, Tailwind CSS 4, React Icons |
| 협업 | GitHub (PR 기반), Notion (태스크 관리) |

> 백엔드는 Python 3.14 문법(괄호 없는 다중 `except`)을 사용하므로 **Python 3.14 이상**이 필요합니다.

<br>

## 프로젝트 구조

```
team-project-1/
├── backend/
│   ├── main.py              # FastAPI 앱, CORS, 라우터 등록
│   ├── core/                # 환경설정, JWT, 비밀번호 해시, 인증 의존성, 직급 정의
│   ├── db/                  # DB 연결(database.py), 전체 모델 등록(models.py)
│   ├── features/            # 기능별 모듈 (router / schema / service / models / exceptions)
│   │   ├── user/            #   회원가입, 로그인, 토큰 재발급
│   │   ├── notice/          #   공지사항
│   │   ├── approval/        #   전자결재
│   │   ├── room/            #   회의실 · 예약
│   │   ├── board/           #   자유게시판
│   │   ├── comment/         #   댓글
│   │   ├── department/      #   부서 관리
│   │   └── admin/           #   사용자 관리
│   ├── alembic/             # DB 마이그레이션
│   ├── .env.example         # 환경변수 예시
│   ├── pyproject.toml / uv.lock
│   └── requirements.txt
│
└── frontend/
    └── src/
        ├── App.tsx          # 라우트 정의
        ├── common/          # axios 인스턴스, 공통 레이아웃·컴포넌트·스타일
        └── features/        # 기능별 화면 (apis / components / hooks / pages / types)
            ├── home/  user/  notice/  approval/
            └── room/  board/  department/  admin/
```

<br>

## 시작하기

### 1. 사전 준비

- Python 3.14 이상 (권장: [uv](https://docs.astral.sh/uv/))
- Node.js (npm 포함)
- 접속 가능한 Oracle Database

### 2. 저장소 받기

```bash
git clone https://github.com/soosung476/team-project-1.git
cd team-project-1
```

### 3. 데이터베이스 연결

백엔드는 `localhost:1522`로 Oracle DB에 접속합니다(`backend/db/database.py`).
팀 클라우드 DB를 쓰는 경우 SSH 터널을 먼저 열어 둡니다.

```bash
ssh -L 1522:127.0.0.1:1521 <사용자>@<DB 서버 주소>
```

> 로컬에 설치한 Oracle DB(기본 포트 1521)를 쓴다면 `backend/db/database.py`의 `port` 값을 바꿔 주세요.

### 4. 백엔드 실행

```bash
cd backend

# 환경변수 파일 만들기
cp .env.example .env
```

`.env`를 열어 실제 값으로 바꿉니다.

| 변수 | 설명 |
| --- | --- |
| `ORACLE_USER` | Oracle 계정 |
| `ORACLE_PASSWORD` | Oracle 비밀번호 |
| `ORACLE_DSN` | 서비스 이름 (예: `FREEPDB1`) |
| `SECRET_KEY` | JWT 서명 키. `python -c "import secrets; print(secrets.token_hex(32))"` 로 생성 |
| `JWT_ALGORITHM` | (선택) 기본값 `HS256` |
| `ACCESS_TOKEN_EXPIRE_SECONDS` | (선택) 기본값 `1800` (30분) |
| `REFRESH_TOKEN_EXPIRE_SECONDS` | (선택) 기본값 `7200` (2시간) |

의존성 설치, 테이블 생성, 서버 실행:

```bash
# uv 사용 시
uv sync
uv run alembic upgrade head
uv run fastapi dev main.py

# pip 사용 시
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
fastapi dev main.py
```

- API 서버: http://localhost:8000
- API 문서(Swagger UI): http://localhost:8000/docs

### 5. 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

- 웹 화면: http://localhost:5173
- 백엔드 CORS가 `http://localhost:5173`만 허용하므로 이 주소로 접속해야 합니다.

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 타입 검사 후 프로덕션 빌드 |
| `npm run lint` | ESLint 검사 |
| `npm run preview` | 빌드 결과 미리보기 |

### 6. 초기 데이터 넣기

화면에서 만들 수 없는 데이터는 DB 도구(DBeaver 등)로 직접 넣습니다.

**첫 관리자 지정** — 회원가입 후 해당 계정의 권한을 바꿉니다. 이후 관리자는 *사용자 관리* 화면에서 다른 사용자를 관리자로 지정할 수 있습니다.

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
COMMIT;
```

**회의실 등록** — 회의실 추가 화면이 없으므로 직접 등록합니다.

```sql
INSERT INTO meeting_rooms (name, capacity, location) VALUES ('회의실 A', 6, '3층');
COMMIT;
```

<br>

## API 개요

전체 명세는 서버 실행 후 `/docs`에서 확인할 수 있습니다.
🔒 로그인 필요 · 👑 관리자 전용

| 기능 | 메서드 · 경로 | 설명 |
| --- | --- | --- |
| 인증 | `POST /auth` | 회원가입 |
| | `POST /auth/login` | 로그인 (Access·Refresh Token 발급) |
| | `POST /auth/refresh` | 토큰 재발급 |
| | `GET /auth/me` 🔒 | 내 정보 |
| 공지사항 | `GET /notice` · `GET /notice/{id}` 🔒 | 목록 · 상세 |
| | `POST` · `PUT /notice/{id}` · `DELETE /notice/{id}` 👑 | 작성 · 수정 · 삭제 |
| 전자결재 | `GET /approvals/{pending\|drafted\|approved\|rejected}` 🔒 | 문서함별 목록 |
| | `GET /approvals/approvers` 🔒 | 결재자 후보 |
| | `POST /approvals` 🔒 | 기안 |
| | `GET /approvals/{id}` 🔒 | 상세 (기안자·결재자만) |
| | `PUT /approvals/{id}` 🔒 | 승인 · 반려 (결재자만) |
| | `DELETE /approvals/{id}` 🔒 | 삭제 (기안자만, 처리 전) |
| 회의실 | `GET /rooms` 🔒 | 회의실 목록 |
| | `GET /rooms/{room_id}/reservations` 🔒 | 날짜별 예약 현황 |
| | `GET /rooms/{room_id}/slots` 🔒 | 30분 단위 예약 가능 시간 |
| | `GET /reservations?scope=mine\|all` 🔒 | 내 / 전체 예약 |
| | `POST /reservations` · `DELETE /reservations/{id}` 🔒 | 예약 · 취소 (본인만) |
| | `GET /admin/reservations` · `DELETE /admin/reservations/{id}` 👑 | 전체 예약 관리 |
| 자유게시판 | `GET /board` | 목록 · 검색 |
| | `GET /board/{id}` 🔒 | 상세 |
| | `POST /board` · `PUT` · `DELETE /board/{id}` 🔒 | 작성 · 수정 · 삭제 |
| 댓글 | `POST /boards/{board_id}/comments` 🔒 | 작성 |
| | `PUT` · `DELETE /boards/{board_id}/comments/{comment_id}` 🔒 | 수정 · 삭제 |
| 부서 | `GET` · `POST /department`, `GET` · `PUT` · `DELETE /department/{id}` 👑 | 부서 관리 |
| 사용자 관리 | `GET /admin/users` · `PATCH /admin/users/{user_id}` 👑 | 사용자 조회 · 권한/직급/부서 변경 |

<br>

## 데이터베이스

테이블은 Alembic 마이그레이션(`backend/alembic/versions`)으로 관리합니다.

| 테이블 | 설명 |
| --- | --- |
| `users` | 사용자 (권한, 직급, 소속 부서) |
| `departments` | 부서 |
| `approval_documents` | 결재 문서 (기안자, 결재자, 상태: `IN_PROGRESS` / `APPROVED` / `REJECTED`) |
| `meeting_rooms` | 회의실 |
| `reservations` | 회의실 예약 |
| `notices` | 공지사항 (상단 고정 여부, 조회수) |
| `board_posts` | 자유게시판 글 |
| `board_comments` | 댓글 (글 삭제 시 함께 삭제) |

모델을 바꾼 뒤에는 마이그레이션 파일을 만들어 적용합니다.

```bash
cd backend
alembic revision --autogenerate -m "변경 내용"
alembic upgrade head
```

> 새 모델을 추가했다면 `backend/db/models.py`에도 import 해야 Alembic이 테이블을 인식합니다.

<br>

## 협업 규칙

### 브랜치
- `main`: 안정 버전
- `develop`: 개발 통합 브랜치 (**모든 PR의 base**)
- `feature/DEV-번호-작업내용`: 기능 작업 브랜치

### 커밋 메시지

```
<타입>: <작업 내용> (DEV-번호)
```

| 타입 | 용도 |
| --- | --- |
| `feat` | 새 기능 |
| `fix` | 버그 수정 |
| `refactor` | 동작 변화 없는 코드 개선 |
| `style` | 화면 디자인 · 코드 스타일 |
| `docs` | 문서 · 주석 |
| `chore` | 설정 · 기타 작업 |

### Pull Request
- 작업은 Notion 태스크(`DEV-번호`) 단위로 진행합니다.
- PR 제목 끝에 `(DEV-번호)`를 붙이고, base 브랜치는 `develop`으로 합니다.
- PR 본문은 템플릿(`.github/pull_request_template.md`)에 따라 *관련 노션 태스크 · 무엇을 했나요 · 확인 방법 · 체크리스트*를 채웁니다.
- 노션 태스크의 PR 속성에 PR 주소를 붙입니다.

<br>

## 팀원

| 이름 (GitHub) | 담당 |
| --- | --- |
| [soosung476](https://github.com/soosung476) | 프로젝트 초기 세팅, DB 스키마, 회원·JWT 인증, 전자결재, 사용자 관리, 홈 대시보드, 공통 레이아웃·디자인 |
| [minjae01-gif](https://github.com/minjae01-gif) | 회의실 예약 (예약·취소, 시간 칸 조회, 내/전체 예약), 관리자 예약 관리 |
| [Jeong-miro](https://github.com/Jeong-miro) | 공지사항 (작성·수정·삭제, 상단 고정) |
| [seojjune](https://github.com/seojjune) | 자유게시판, 댓글, 검색·조회수 |
| [godduk7772-stack](https://github.com/godduk7772-stack) | 부서 관리, 관리자 권한 검사 |
