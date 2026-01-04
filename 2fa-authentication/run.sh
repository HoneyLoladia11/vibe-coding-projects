#!/bin/bash

echo "🚀 Starting Vibe Coding 2FA Application"
echo "========================================"

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ .env created. Please edit it with your settings."
    echo ""
    echo "Don't forget to:"
    echo "  1. Set your DATABASE_URL"
    echo "  2. Set your SECRET_KEY"
    echo "  3. Set your TELEGRAM_BOT_TOKEN"
    echo ""
    read -p "Press Enter to continue after editing .env..."
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -q -r requirements.txt

# Check if PostgreSQL and Redis are running
echo "🔍 Checking services..."

# Start Docker services if docker-compose exists
if command -v docker-compose &> /dev/null; then
    echo "🐳 Starting PostgreSQL and Redis with Docker..."
    docker-compose up -d
    echo "⏳ Waiting for services to be ready..."
    sleep 5
else
    echo "⚠️  Docker Compose not found. Make sure PostgreSQL and Redis are running manually."
fi

# Run migrations
echo "🗄️  Running database migrations..."
if [ ! -d "alembic/versions" ] || [ -z "$(ls -A alembic/versions)" ]; then
    echo "Creating initial migration..."
    alembic revision --autogenerate -m "Initial migration"
fi
alembic upgrade head

# Start application
echo ""
echo "✅ Starting FastAPI application..."
echo "📍 API will be available at: http://localhost:8000"
echo "📚 Docs will be available at: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop"
echo ""

python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
