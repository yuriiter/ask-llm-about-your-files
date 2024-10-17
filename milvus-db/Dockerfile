FROM python:3.13.0-alpine3.19

WORKDIR /app

COPY requirements.txt requirements.txt

RUN pip -r requirements.txt

COPY . /app

CMD ["python", "src/main.py"]
