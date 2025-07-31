import os
import sys
import django
from dotenv import load_dotenv
from pathlib import Path

def init_django():
    BASE_DIR = Path(__file__).resolve().parent
    DJANGO_DIR = (BASE_DIR / "django_app").resolve()  
    
    # 도커와 로컬 둘 다 실행 가능하게 하고 싶어서 이벤트 작업중
    
    # 경로 인식 분기점
    # docker_path = (BASE_DIR / "django_app")
    # local_path = (BASE_DIR / "../django_app")
    
    # 입력 명령어 감지
    # is_local = "--local" in sys.argv or "uvicorn" in " ".join(sys.argv)
    # print(is_local)
    
    
    # if docker_path.exists():
    #     DJANGO_DIR = (BASE_DIR / "django_app").resolve()  
    # else:
    #     DJANGO_DIR = local_path.resolve()
    
    # 로컬 / 도커 분기점
    # if is_local:
    #     # 로컬 환경
    #     DJANGO_DIR = (BASE_DIR / "../django_app").resolve()
    #     print("로컬 환경 감지됨 (uvicorn 명령어)")
    # else:
    #     # Docker 환경
    #     DJANGO_DIR = (BASE_DIR / "django_app").resolve()
    #     print("Docker 환경 감지됨")
    
    # print(f"Django 디렉토리: {DJANGO_DIR}")
    # print(f"Django 디렉토리 존재: {DJANGO_DIR.exists()}")
    
    # 핵심 포인트: Django 프로젝트 루트를 sys.path에 추가
    sys.path.insert(0, str(DJANGO_DIR))# Django 프로젝트 루트 추가

    # 기본 .env 파일
    load_dotenv(DJANGO_DIR / ".env", override=False)

    # ENV 설정에 따라 추가 .env 로드
    env = os.getenv("ENV", "development")
    env_path = DJANGO_DIR / f".env.{env}"
    if env_path.exists():
        load_dotenv(dotenv_path=env_path, override=True)

    # .env.local 우선순위
    local_path = DJANGO_DIR / ".env.local"
    if local_path.exists():
        load_dotenv(dotenv_path=local_path, override=True)

    # settings 모듈 로딩
    settings_module = os.getenv("DJANGO_SETTINGS_MODULE", "config.settings.dev")
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", settings_module)
    print("DJANGO_SETTINGS_MODULE:", settings_module)

    # Django 초기화
    try: 
        django.setup()
    except Exception as e:
        print(f"Django 초기화 중 에러 발생: {e}")