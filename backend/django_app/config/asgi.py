"""
ASGI config for config project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

# 실시간 통신 (웹소켓 포함)

import os
from django.core.asgi import get_asgi_application
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


application = get_asgi_application()
