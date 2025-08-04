import os
import sys
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent

# 공통 환경 변수 로드
common_env = BASE_DIR / ".env.common"
if common_env.exists():
    load_dotenv(common_env, override=False)
    
# 환경 변수 설정 (기본 값 local)
env = os.getenv("ENV","local")
env_to_settings = {
    "local":"local",
    "development":"dev",
    "production":"prod",
}
env_file = BASE_DIR / f".env.{env}"

# 선택된 환경에 맞는 .env 파일 로드
if env_file.exists():
    load_dotenv(env_file, override=True)
else:
    raise FileNotFoundError(f"지정된 환경 파일이 없습니다: {env_file}")

# setting 값 설정
setting_key = env_to_settings.get(env, "local")
setting_file = f"django_app.config.settings.{setting_key}"

# django 세팅 등록
os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    f"django_app.config.settings.{setting_key}"
)

def main():
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError("manage.py error") from exc_info()
    
    execute_from_command_line(sys.argv)
    

if __name__ == "__main__":
    main()