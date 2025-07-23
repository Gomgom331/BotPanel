FROM python:3.13
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY ../ .
CMD ["uvicorn", "main:app", "--port", "9000", "--reload"]