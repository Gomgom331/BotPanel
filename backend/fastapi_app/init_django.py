import os
import sys
import django
from dotenv import load_dotenv
from pathlib import Path

def init_django():
    BASE_DIR = Path(__file__).resolve().parent
    FASTAPI_DIR = BASE_DIR
    DJANGO_DIR = (BASE_DIR / "django_app").resolve()

    # print("DJANGO_DIR:", DJANGO_DIR)
    # print("FASTAPI_DIR:", FASTAPI_DIR)
    # print("Django module path:", django.__file__)

    # 핵심 포인트: 'config' 폴더가 포함된 경로를 sys.path 에 넣음
    sys.path.insert(0, str(DJANGO_DIR))  # /app/django_app/config 를 import 가능하게

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
    django.setup()