import os
import sys
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# env load  
load_dotenv(".env", override=False)

env = os.getenv("ENV", "development")
env_file = f".env.{env}"


if os.path.exists(env_file):
    load_dotenv(env_file, override=True)

# 로컬 파일이 있으면 실행
if os.path.exists(".env.local"):
    load_dotenv(".env.local", override=True)


def main():
    """Run administrative tasks."""
    os.environ.setdefault(
        'DJANGO_SETTINGS_MODULE',
        os.getenv("DJANGO_SETTINGS_MODULE", "django_app.config.settings.base")  # 기본값 지정
    )
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "django - manage.py error"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
