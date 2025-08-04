# 전체 환경 셋팅

## 패키지 저장 ---------------
파이썬 패키지를 설정 후 `requirements.txt` 에 저장해주기

    - 패키지 저장 :
        `pip freeze > requirements.txt`
    - 패키지 적용 :
        `pip list --format=freeze > requirements.txt`

## .env ---------------
```
예외적으로 React 에서는 .env를 자동으로 로드하기 때문에 아래 처럼 사용
.env / .env.local / .env.dev /.env.production

    - local : .env / .env.local 
    - docker : .env / .env.dev 
    - prod : .env / .env.production

```

1. .env.local :
    개인설정 (가장 우선 설정)/ 개발자 개인 PC
2. .env.development, .env.production : 환경별 설정 개발 / 운영 
    - .env.development : 개발서버 (도커)
        팀원 전체가 공유하는 개발용
    - .env.production : 운영서버
        사용자에게 노출이 되는 진짜 배포서버용 (DB/결제/인증 등)
    `도커를 도입하면서 가상환경에서 실행하기 위해 개발은 도커 나머지는 로컬용으로 지정`         
3. .env : 기본값 / 없는 경우 .env.common 이 해당 역할을 함
4. .env.example: 환경변수에 들어가는 변수 명 저장

=> 현재 총 3개의 env 파일이 3군데에 있음
    - backend/fastpi => config 에서 관리
    - backend/django  => django_init 에서 관리
    - frontend/react 

5. 프로그램에 따른 env 적용 방법
    - django / fastapi
        .env 파일을 직접 읽어서 (dotenv) 환경변수로 사용
        ```python
        import os
        API_KEY = os.environ.get("API_KEY")
        ```
    
    - React
        환경변수는 빌드 타임에만 반영이 되어 process.env 로 접근함 반드시 변수명 앞에는 `REACT_APP`을 붙여야함

        ```react
        baseURL: process.env.REACT_APP_API_BASE_URL
        timeout: Number(process.env REACT_APP_AXIOS_TIMEOUT)
        ```


## Port ---------------
`FastAPI 에서 Django User 모델 직접 로드`
Django 유저 DB, ORM 그대로 유지 및 활용을 하고
비동기 FastAPI 성능으로 유지하기
(한 프로젝트 안에서 두 프레임워크를 연결할 수 있음')

    - react : 3000
        => `npm start`
    - django modle : 8000
        개발 : `python manage.py runserver 8000`
            `$env:ENV="development; python manage.py runserver 8000`
            => 기본이 개발로 설정을 했기 때문에 개발 명령어는 변수가 필요없이 runserver를 하면됨
        운영 => `$env:ENV="production"; python manage.py runserver 8000`
    - uvicorn : 9000
        Docker: `docker-compose up --build`
        로컬: `cd backend/fastapi_app && uvicorn main:app --reload --port 9000`
 
# 도커 셋팅 (Compose V2 사용)

## 설치방법 ---------------

Docker Desktop 실행 → Settings → General
"Use Docker Compose V2" 체크!

    - docker desktop 설치 
    - docker desktop을 실행 후 build 하기
        => backend 에만 requirements.txt 있기 때문에 아래 명령어로 실행시켜주기 (복사해주기..)
        ```
            cp backend/requirements.txt backend/django/requirements.txt
            cp backend/requirements.txt backend/fastapi/requirements.txt
            docker compose up --build
        ```
    - React 프로젝트 충돌 (peer dependency 충돌) react-scripts@5.0.1과 typescript@5.x의 버전 불일치
        => peer dependency 충돌을 무시하고 설치해주는 옵션 (react-scripts@5에서 이 옵션은 거의 필수)
        ```
        RUN npm install --legacy-peer-deps
        ```
    - docker 실행 명령어
        ```
        # window
        docker-compose up --build
        # max
    ```

## Django / FastApi Docker 연결
Django의 모델을 FastApi가 접근해서 사용하기 위해 `docker-compose.yml`파일에
해당 아래 코드 값 때문에 (마운트를 하기 위한 경로 값) 폴더가 생성이 됨

    1. ./backend/fastapi_app:/app - fastapi_app 폴더를 컨테이너의 /app에 마운트
    2. ./backend/django_app:/app/django_app - django_app 폴더를 컨테이너의 /app/django_app에 마운트
    3. ./backend/django_app:/app/django_app - django_app 폴더를 컨테이너의 /app/django_app에 마운트

    ``` docker-compose.yml
    volumes:
    - ./backend/fastapi_app:/app
    - ./backend/django_app:/app/django_app 

    ```

# 작업 미완료 (결과가 실패)
backend/fastapi_app/init_django.py 안을 보면 
Docker 환경에서 fastapi_app 폴더 안에 django_app 폴더가 있어야 접근이 가능해
volume 마운트로 해당 구조를 만들어 줌

    ``` init_django.py
    docker_path = (BASE_DIR / "django_app")
    local_path = (BASE_DIR / "../django_app")

    if docker_path.exists():
        DJANGO_DIR = (BASE_DIR / "django_app").resolve()  
    else:
        DJANGO_DIR = local_path.resolve()

    ```

혹여나 docker가 아닌 local에서 실행시킬때를 위해 구분짐
    ```
    BASE_DIR = Path(__file__).resolve().parent
    
    # 경로 인식 분기점
    docker_path = (BASE_DIR / "django_app")
    local_path = (BASE_DIR / "../django_app")
    
    if docker_path.exists():
        DJANGO_DIR = (BASE_DIR / "django_app").resolve()  
    else:
        DJANGO_DIR = local_path.resolve()

    ```



- docker desktop 설치 
- docker desktop을 실행 후 build 하기
    => backend 에만 requirements.txt 있기 때문에 아래 명령어로 실행시켜주기 (복사해주기..)
    ```
        cp backend/requirements.txt backend/django_app/requirements.txt
        cp backend/requirements.txt backend/fastapi_app/requirements.txt
        docker compose up --build
    ```
- React 프로젝트 충돌 (peer dependency 충돌) react-scripts@5.0.1과 typescript@5.x의 버전 불일치
    => peer dependency 충돌을 무시하고 설치해주는 옵션 (react-scripts@5에서 이 옵션은 거의 필수)
    ```
    RUN npm install --legacy-peer-deps
    ```

- 실행 명령어
    -- 일반 실행
    `docker-compose up`
    -- 빌드 실행
    `docker-compose up --build`
    -- 만약 오류가 나 해당 컨테이너를 삭제 해야될시
    `docker rm 컨테이너명`


# Mac 설정

## 환경 설정 명령어
```
git clone <your-repo>
cd your-repo

cp .env.example .env

docker-compose down --volumes --remove-orphans
docker-compose up --build
```


# Git 설정




# docker / fastapi url 파라미터 설정
- django api : 사용자 인증 / 로그인 / 게시판
- fast api : LLM / 다량의 데이터 리스트 / 외부 api

=> 클라이언트측 (프론트에서) 해당 url을 전송하면 Axios.py 에서 구분
    djangoAPI : `fetch("api/login?source=djangapi")`
    fastAPI : `fetch("api/test?source=fastapi")`























