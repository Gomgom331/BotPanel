# import sys
# import os
# import django
# from pathlib import Path
# from dotenv import load_dotenv


# def init_django():
    
#     BASE_DIR = Path(__file__).resolve().parent.parent
#     # 장고 경로 설정
#     DJANGO_DIR = BASE_DIR / "django"
    
        
#     if str(DJANGO_DIR) not in sys.path:
#         sys.path.insert(0, str(DJANGO_DIR))
        
#     # print('1111')
#     # print("BASE_DIR",BASE_DIR)
#     # print("DJANGO_DIR", DJANGO_DIR)
    
#     # django 경로 등록 (절대경로로 변환)
#     django_path = str(DJANGO_DIR.absolute())
#     if django_path not in sys.path:
#         sys.path.insert(0, django_path)
    
#     # print('2222')
#     # print("django_path", django_path)

    
#     # 환경설정 파일 로드 (순서: .env -> .env.{ENV} -> .env.local)
#     load_dotenv(DJANGO_DIR / ".env", override=False)
    
#     env = os.getenv("ENV", "development")
#     env_path = DJANGO_DIR / f".env.{env}"
    
#     # print('3333')
#     # print('env_path',env_path)
    
#     if env_path.exists():
#         load_dotenv(dotenv_path=env_path, override=True)
    
#     local_path = DJANGO_DIR / ".env.local"
#     if local_path.exists():
#         load_dotenv(dotenv_path=local_path, override=True)
    
#     # django 설정 모듈 설정
#     env = os.getenv("ENV", "development")
    
#     # print('4444')
#     # print('env',env)
    
#     if env == "development":
#         print('5')
#         DJANGO_SETTINGS = os.getenv("DJANGO_SETTINGS_MODULE", "config.settings.dev")
#         print("DJANGO_SETTINGS",DJANGO_SETTINGS)
#     elif env == "production":
#         print('6')
#         DJANGO_SETTINGS = os.getenv("DJANGO_SETTINGS_MODULE", "config.settings.prod")
#         print("DJANGO_SETTINGS",DJANGO_SETTINGS)
#     else:
#         print('7')
#         DJANGO_SETTINGS = os.getenv("DJANGO_SETTINGS_MODULE", "config.settings.base")
#         print("DJANGO_SETTINGS",DJANGO_SETTINGS)

#     # 장고사 사용할 설정 파일을 환경변수로 등록해줌
#     os.environ.setdefault("DJANGO_SETTINGS_MODULE", DJANGO_SETTINGS)
    
#     # django 설정 실행
#     print('8')
#     django.setup()


    # 경로 확인 디버깅
    # print("sys.path:", sys.path)
    # print("config exists:", os.path.isdir(os.path.join(django_path, "config")))
    # print("settings exists:", os.path.isdir(os.path.join(django_path, "config", "settings")))
    # print("dev.py exists:", os.path.isfile(os.path.join(django_path, "config", "settings", "dev.py")))
    # print("__init__ in config:", os.path.isfile(os.path.join(django_path, "config", "__init__.py")))
    # print("__init__ in settings:", os.path.isfile(os.path.join(django_path, "config", "settings", "__init__.py")))

import sys
import os
import django
from pathlib import Path
from dotenv import load_dotenv

def init_django():
    BASE_DIR = Path(__file__).resolve().parent.parent
    DJANGO_DIR = BASE_DIR / "django"
    
    # 장고 루트 폴더 등록
    sys.path.insert(0, str(DJANGO_DIR))
    
    # .env 설정 불러오기
    load_dotenv(DJANGO_DIR / ".env", override=False)
    env = os.getenv("ENV", "development")
    
    # .env 설정 불러오기
    env_path = DJANGO_DIR / f".env.{env}"
    if env_path.exists():
        load_dotenv(dotenv_path=env_path, override=True)

    local_path = DJANGO_DIR / ".env.local"
    if local_path.exists():
        load_dotenv(dotenv_path=local_path, override=True)
                    
    # DJANGO_SETTINGS_MODULE 지정
    if env == "development":
        DJANGO_SETTINGS = os.getenv("DJANGO_SETTINGS_MODULE", "config.settings.dev")
    elif env == "production":
        DJANGO_SETTINGS = os.getenv("DJANGO_SETTINGS_MODULE", "config.settings.prod")
    else:
        DJANGO_SETTINGS = os.getenv("DJANGO_SETTINGS_MODULE", "config.settings.base")

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", DJANGO_SETTINGS)
    
    # django 초기화
    django.setup()