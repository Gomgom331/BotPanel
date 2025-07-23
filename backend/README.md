# settings

## Port 
`FastAPI 에서 Django User 모델 직접 로드`
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
    