# ==============================================================================
# ChaosResilience - Backend Service Dockerfile
# Lightweight Python container running Flask REST API
# ==============================================================================

FROM python:3.11-slim

# Prevent Python from writing .pyc files and buffer stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install dependencies first for Docker layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY app.py .
COPY chaos_engine.py .
COPY test_api.py .
COPY README.md .

# Expose backend port
EXPOSE 5000

# Default environment configuration
ENV HOST=0.0.0.0
ENV PORT=5000

# Real Docker HEALTHCHECK verifying live GET /health
HEALTHCHECK --interval=5s --timeout=3s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request, sys; sys.exit(0 if urllib.request.urlopen('http://localhost:5000/health').getcode() == 200 else 1)"

# Start Flask application
CMD ["python", "app.py"]
