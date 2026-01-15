# 2FA Authentication Project - Ready to Deploy

## Quick Setup

### Backend
```bash
cd backend
copy .env.example .env
# Edit .env: add SECRET_KEY and TELEGRAM_BOT_TOKEN
docker-compose build --no-cache
docker-compose up -d
docker-compose exec backend bash
alembic upgrade head
exit
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Ports
- Backend: http://localhost:8000
- Frontend: http://localhost:5173 or http://localhost:8080
- API Docs: http://localhost:8000/docs

## Status
✅ All 6 critical fixes applied
✅ Backend tested and working
✅ Ready for production
