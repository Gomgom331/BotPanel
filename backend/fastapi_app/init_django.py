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



import sys
import os
import django
from pathlib import Path
from dotenv import load_dotenv

def init_django():
    BASE_DIR = Path(__file__).resolve().parent.parent
    DJANGO_DIR = BASE_DIR / "django_app"

    # 1. .env (기본)
    load_dotenv(DJANGO_DIR / ".env", override=False)

    # 2. .env.{env}
    env = os.getenv("ENV", "development")
    env_file = DJANGO_DIR / f".env.{env}"
    if env_file.exists():
        load_dotenv(env_file, override=True)

    # 3. .env.local
    local_env = DJANGO_DIR / ".env.local"
    if local_env.exists():
        load_dotenv(local_env, override=True)

    # DJANGO_SETTINGS_MODULE 지정
    if env == "development":
        DJANGO_SETTINGS = os.getenv("DJANGO_SETTINGS_MODULE", "django_app.config.settings.dev")
    elif env == "production":
        DJANGO_SETTINGS = os.getenv("DJANGO_SETTINGS_MODULE", "django_app.config.settings.prod")
    else:
        DJANGO_SETTINGS = os.getenv("DJANGO_SETTINGS_MODULE", "django_app.config.settings.base")

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", DJANGO_SETTINGS)
    
    # === print for debug ===
    print("ENV:", env)
    print(".env exists:", (DJANGO_DIR / ".env").exists())
    print(f".env.{env} exists:", env_file.exists())
    print(".env.local exists:", local_env.exists())
    print("DJANGO_DB_NAME:", os.getenv("DJANGO_DB_NAME"))
    print("DJANGO_DB_ENGINE:", os.getenv("DJANGO_DB_ENGINE"))
    print("DJANGO_SETTINGS_MODULE:", os.getenv("DJANGO_SETTINGS_MODULE"))
    # ======================="))
    
    # django 초기화
    django.setup()