import os
import sys
import django
from dotenv import load_dotenv
from pathlib import Path

def init_django():
    # 기본 경로
    BASE_DIR = Path(__file__).resolve().parent
    django_dir_path = os.getenv("DJANGO_APP_DIR","../django_app")
        # 경로  분기점 --------------
        # docker_path = (BASE_DIR / "django_app")
        # local_path = (BASE_DIR / "../django_app")
        
    # 장고 경로
    DJANGO_DIR = (BASE_DIR / django_dir_path).resolve()  

    # Django 프로젝트 루트를 sys.path에 추가
    sys.path.insert(0, str(DJANGO_DIR))

    # django 공용 .env 파일 로드
    load_dotenv(DJANGO_DIR / ".env.common", override=False)

    # ENV 설정에 따라 추가 .env 로드
    env = os.getenv("ENV", "local")
    env_path = DJANGO_DIR / f".env.{env}"
    if env_path.exists():
        load_dotenv(dotenv_path=env_path, override=True)
    

    # settings 모듈 로딩
    settings_module = os.getenv("DJANGO_SETTINGS_MODULE", "config.settings.local")
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", settings_module)

    # Django 초기화
    try: 
        django.setup()
    except Exception as e:
        print(f"Django 초기화 중 에러 발생: {e}")