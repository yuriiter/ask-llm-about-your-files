FROM python:3.9-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
  build-essential \
  python3-dev \
  libmupdf-dev \
  git \
  && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

CMD ["python", "main.py"]
