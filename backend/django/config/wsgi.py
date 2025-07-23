"""
WSGI config for config project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

# 웹서버 동기용

import os
from django.core.wsgi import get_wsgi_application
from dotenv import load_dotenv

# env load 
load_dotenv(".env", override=False)

env = os.getenv("ENV", "development")
env_file = f".env.{env}"
if os.path.exists(env_file):
    load_dotenv(env_file, override=True)

# 로컬 파일이 있으면 실행
if os.path.exists(".env.local"):
    load_dotenv(".env.local", override=True)


application = get_wsgi_application()
