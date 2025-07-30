# 전체 환경 셋팅

## 패키지 저장 ---------------
파이썬 패키지를 설정 후 `requirements.txt` 에 저장해주기

- 패키지 저장 :
    `pip freeze > requirements.txt`
- 패키지 적용 :
    `pip list --format=freeze > requirements.txt`

## .env ---------------
- 우선 순위
    1. .env.local :
        개인설정 (가장 우선 설정)/ 개발자 개인 PC
    2. .env.development, .env.production : 환경별 설정 개발 / 운영
        - .env.development : 개발서버
            팀원 전체가 공유하는 개발용
        - .env.production : 운영서버
            사용자에게 노출이 되는 진짜 배포서버용 (DB/결제/인증 등)
    3. .env : 기본값
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
    `uvicorn main:app --reload --port 9000`
    


# 도커 셋팅 (Compose V2 사용)

## 설치방법 ---------------

Docker Desktop 실행 → ⚙️ Settings → General
“Use Docker Compose V2” 체크!

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

























