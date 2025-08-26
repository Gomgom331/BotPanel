from pathlib import Path
import os
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[2]

# key
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')
# debug
DEBUG = os.getenv('DJANGO_DEBUG')

# time
LANGUAGE_CODE = os.getenv('DJANGO_LANGUAGE_CODE')
TIME_ZONE = os.getenv('DJANGO_TIME_ZONE')

SYSTEM_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

CUSTOM_APPS = [
    'corsheaders',
    'api',
    'users',
]

INSTALLED_APPS = SYSTEM_APPS + CUSTOM_APPS

# middleware
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

# templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# 도커에서 Path 가 들어갈 경우 오류가 생겨 USE_SQLITE를 통해 구분지어서 나눔
USE_SQLITE = os.getenv("USE_SQLITE", "false").lower() == "true"
if USE_SQLITE:
    DATABASES = {
        'default': {
            'ENGINE': os.getenv('DJANGO_DB_ENGINE'),
            'NAME': BASE_DIR / os.getenv('DJANGO_DB_NAME'),
            'USER': os.getenv('DJANGO_DB_USER', ''),
            'PASSWORD': os.getenv('DJANGO_DB_PASSWORD', ''),
            'HOST': os.getenv('DJANGO_DB_HOST', ''),
            'PORT': os.getenv('DJANGO_DB_PORT', ''),
        }
    }
    
else:
    # database
    DATABASES = {
        'default': {
            'ENGINE': os.getenv('DJANGO_DB_ENGINE'),
            'NAME': os.getenv('DJANGO_DB_NAME'),
            'USER': os.getenv('DJANGO_DB_USER', ''),
            'PASSWORD': os.getenv('DJANGO_DB_PASSWORD', ''),
            'HOST': os.getenv('DJANGO_DB_HOST', ''),
            'PORT': os.getenv('DJANGO_DB_PORT', ''),
        }
    }



# auth / 비밀번호 제약조건 제거
AUTH_PASSWORD_VALIDATORS = []

# static
STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'



# hosts
ALLOWED_HOSTS = [host for host in os.getenv("DJANGO_ALLOWED_HOSTS", "").split(",") if host]

# csrf 주소 허용
CORS_ALLOW_CREDENTIALS = True

# origins
CORS_ALLOWED_ORIGINS = [
    origin for origin in os.getenv("DJANGO_CORS_ALLOWED_ORIGINS", "").split(",") if origin
]
CORS_ALLOW_ALL_ORIGINS = os.getenv('DJANGO_CORS_ALLOW_ALL_ORIGINS') == 'True'

# 커스텀 모델 등록
AUTH_USER_MODEL = 'users.CustomUser'

# 세션 / 쿠키 (개발 기본값)
SESSION_COOKIE_SAMESITE = os.getenv("SESSION_COOKIE_SAMESITE")
CSRF_COOKIE_SAMESITE = os.getenv("CSRF_COOKIE_SAMESITE")
SESSION_COOKIE_SECURE = os.getenv("SESSION_COOKIE_SECURE")
CSRF_COOKIE_SECURE = os.getenv("CSRF_COOKIE_SECURE")

# SPA에서 csrftoken을 js로 읽어 헤더에  실어보내야 하므로 HttpOnly는 False를 해주는게 좋음
CSRF_COOKIE_HTTPONLY = os.getenv("CSRF_COOKIE_HTTPONLY")