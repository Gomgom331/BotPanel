# settings

## Port 
`FastAPI 에서 Django users 모델 직접 로드`
Django 유저 DB, ORM 그대로 유지 및 활용을 하고
비동기 FastAPI 성능으로 유지하기
(한 프로젝트 안에서 두 프레임워크를 연결할 수 있음')

 - django modle : 8000
   개발 : `python manage.py runserver 8000`
         `$env:ENV="development; python manage.py runserver 8000`
         => 기본이 개발로 설정을 했기 때문에 개발 명령어는 변수가 필요없이 runserver를 하면됨

   운영 : `$env:ENV="production"; python manage.py runserver 8000`

    
 - uvicorn : 9000
    `uvicorn main:app --reload --port 9000`
    
## Model / App 추가
API 엔드포인트로 api에서 관리하지만 각 모델들은 기능별로 App을 생성하여 관리하기

`유저 모델을 커스텀화로 진행 (django 기본 모델 X)`
- django_app/api # api 앤드포인트
- django_app/users # users 앱 (기능별로 생성)

