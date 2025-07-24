# import sys
# import os
# import django
# from pathlib import Path
# from dotenv import load_dotenv

# def init_django():
#     BASE_DIR = Path(__file__).resolve().parent.parent
#     DJANGO_DIR = BASE_DIR / "django_app"
    
#     # 장고 루트 폴더 등록
#     sys.path.insert(0, str(DJANGO_DIR))
    
#     # .env 설정 불러오기
#     load_dotenv(DJANGO_DIR / ".env", override=False)
#     env = os.getenv("ENV", "development")
    
#     # .env 설정 불러오기
#     env_path = DJANGO_DIR / f".env.{env}"
#     if env_path.exists():
#         load_dotenv(dotenv_path=env_path, override=True)

#     local_path = DJANGO_DIR / ".env.local"
#     if local_path.exists():
#         load_dotenv(dotenv_path=local_path, override=True)
                    
#     # DJANGO_SETTINGS_MODULE 지정
#     if env == "development":
#         DJANGO_SETTINGS = os.getenv("DJANGO_SETTINGS_MODULE", "django_app.config.settings.dev")
#     elif env == "production":
#         DJANGO_SETTINGS = os.getenv("DJANGO_SETTINGS_MODULE", "django_app.config.settings.prod")
#     else:
#         DJANGO_SETTINGS = os.getenv("DJANGO_SETTINGS_MODULE", "django_app.config.settings.base")

#     os.environ.setdefault("DJANGO_SETTINGS_MODULE", DJANGO_SETTINGS)
    
#     # django 초기화
#     django.setup()


# backend/fastapi/init_django.py

# import os
# import sys
# import django
# from dotenv import load_dotenv
# from pathlib import Path

# def init_django():
#     BASE_DIR = Path(__file__).resolve().parent
#     FASTAPI_DIR = BASE_DIR
#     DJANGO_DIR = (BASE_DIR / "../django_app").resolve()

#     print("DJANGO_DIR:", DJANGO_DIR)
#     print("FASTAPI_DIR:", FASTAPI_DIR)
#     print("Django module path:", django.__file__)


#     sys.path.insert(0, str(DJANGO_DIR.parent))

#     # 1. .env 기본 파일 로드
#     load_dotenv(DJANGO_DIR / ".env", override=False)

#     # 2. ENV 값에 따라 다른 .env 파일 로드
#     env = os.getenv("ENV", "development")
#     env_path = DJANGO_DIR / f".env.{env}"
#     if env_path.exists():
#         load_dotenv(dotenv_path=env_path, override=True)

#     # 3. .env.local 로드 (가장 마지막 우선순위)
#     local_path = DJANGO_DIR / ".env.local"
#     if local_path.exists():
#         load_dotenv(dotenv_path=local_path, override=True)

    
#     # 4. settings 지정 (환경변수에서 읽은 값 사용)
#     settings_module = os.getenv("DJANGO_SETTINGS_MODULE", "config.settings.dev")
#     os.environ.setdefault("DJANGO_SETTINGS_MODULE", settings_module)
    
#     print("DJANGO_SETTINGS_MODULE:", settings_module)

#     # 5. Django 초기화
#     django.setup()


import os
import sys
import django
from dotenv import load_dotenv
from pathlib import Path

def init_django():
    BASE_DIR = Path(__file__).resolve().parent
    FASTAPI_DIR = BASE_DIR
    DJANGO_DIR = (BASE_DIR / "../django_app").resolve()

    print("DJANGO_DIR:", DJANGO_DIR)
    print("FASTAPI_DIR:", FASTAPI_DIR)
    print("Django module path:", django.__file__)

    sys.path.insert(0, str(DJANGO_DIR.parent))  # 핵심 포인트!

    # 1. .env 로드
    load_dotenv(DJANGO_DIR / ".env", override=False)
    env = os.getenv("ENV", "development")
    env_path = DJANGO_DIR / f".env.{env}"
    if env_path.exists():
        load_dotenv(dotenv_path=env_path, override=True)
    local_path = DJANGO_DIR / ".env.local"
    if local_path.exists():
        load_dotenv(dotenv_path=local_path, override=True)

    # settings 설정 및 확인
    settings_module = os.getenv("DJANGO_SETTINGS_MODULE", "config.settings.dev")
    print("DJANGO_SETTINGS_MODULE:", settings_module)
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", settings_module)

    # Django 초기화
    django.setup()