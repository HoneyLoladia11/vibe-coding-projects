# Backend - FastAPI 2FA Authentication System

FastAPI backend with Telegram 2FA, role-based access, and comprehensive admin panel.

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
docker-compose up
```

Backend will be available at: `http://localhost:8000`

### Option 2: Manual Setup

**1. Install Dependencies:**
```bash
pip install -r requirements.txt
```

**2. Setup Environment:**
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your settings:
# - DATABASE_URL
# - TELEGRAM_BOT_TOKEN
# - JWT_SECRET_KEY
```

**3. Setup Database:**
```bash
# Run migrations
alembic upgrade head

# Create admin user
python create_admin.py
```

**4. Start Server:**
```bash
# Development
uvicorn app.main:app --reload

# Or use the helper script
./run.sh
```

## 📚 API Documentation

Once running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **Health Check:** http://localhost:8000/health

## 🔑 Environment Variables

Required variables in `.env`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# JWT Settings
JWT_SECRET_KEY=your-super-secret-key-change-this
JWT_ALGORITHM=HS256
JWT_EXPIRATION_MINUTES=30

# Telegram Bot (for 2FA)
TELEGRAM_BOT_TOKEN=your-bot-token-from-botfather

# Redis Cache
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# App Settings
DEBUG=True
APP_NAME="2FA Authentication API"
```

## 🏗️ Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Configuration
│   ├── database.py          # Database connection
│   ├── models/              # SQLAlchemy models
│   │   ├── user.py
│   │   ├── tool.py
│   │   ├── tool_rating.py
│   │   └── tool_comment.py
│   ├── schemas/             # Pydantic schemas
│   │   ├── user.py
│   │   ├── tool.py
│   │   └── rating_comment.py
│   ├── routers/             # API endpoints
│   │   ├── auth.py          # Authentication & 2FA
│   │   ├── tools.py         # Tool CRUD
│   │   ├── admin.py         # Admin panel
│   │   └── ratings_comments.py  # Ratings & Comments
│   ├── services/            # Business logic
│   │   ├── telegram.py      # Telegram 2FA
│   │   ├── cache.py         # Redis caching
│   │   └── audit.py         # Audit logging
│   ├── middleware/          # Custom middleware
│   │   └── auth.py          # Role-based access
│   └── utils/               # Helper functions
│       └── security.py      # JWT, password hashing
├── alembic/                 # Database migrations
├── requirements.txt         # Python dependencies
├── docker-compose.yml       # Docker setup
└── README.md               # This file
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (returns JWT)
- `POST /api/auth/verify-2fa` - Verify 2FA code
- `POST /api/auth/enable-2fa` - Enable Telegram 2FA
- `POST /api/auth/disable-2fa` - Disable 2FA
- `GET /api/auth/me` - Get current user

### Tools
- `GET /api/tools` - List tools (with filters)
- `POST /api/tools` - Create tool
- `GET /api/tools/{id}` - Get tool details
- `PUT /api/tools/{id}` - Update tool
- `DELETE /api/tools/{id}` - Delete tool
- `GET /api/tools/my` - My tools

### Ratings
- `POST /api/tools/{id}/rate` - Rate tool
- `GET /api/tools/{id}/my-rating` - Get my rating
- `GET /api/tools/{id}/ratings/stats` - Rating statistics
- `DELETE /api/tools/{id}/rate` - Delete rating

### Comments
- `POST /api/tools/{id}/comments` - Add comment
- `GET /api/tools/{id}/comments` - Get comments
- `PUT /api/tools/{id}/comments/{cid}` - Update comment
- `DELETE /api/tools/{id}/comments/{cid}` - Delete comment
- `POST /api/tools/{id}/comments/{cid}/vote` - Vote (up/down)

### Admin (Moderator/Admin only)
- `GET /api/admin/tools/pending` - Pending tools
- `POST /api/admin/tools/{id}/approve` - Approve tool
- `POST /api/admin/tools/{id}/reject` - Reject tool
- `GET /api/admin/users` - List users
- `PUT /api/admin/users/{id}/role` - Change user role
- `GET /api/admin/statistics` - Dashboard stats

## 🧪 Testing

```bash
# Run test script
python test_api.py

# Or manual testing
curl http://localhost:8000/health
```

## 🛠️ Development

### Create Admin User
```bash
python create_admin.py
```

### Database Migrations
```bash
# Create migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

### Clear Redis Cache
```bash
redis-cli FLUSHALL
```

## 📦 Dependencies

Main packages:
- **FastAPI** - Web framework
- **Uvicorn** - ASGI server
- **SQLAlchemy** - ORM
- **Alembic** - Migrations
- **Pydantic** - Data validation
- **PostgreSQL** - Database
- **Redis** - Caching
- **python-jose** - JWT
- **passlib** - Password hashing
- **python-telegram-bot** - Telegram integration

## 🔒 Security Features

- ✅ JWT token authentication
- ✅ Bcrypt password hashing
- ✅ Telegram 2FA
- ✅ Role-based access control
- ✅ SQL injection protection (SQLAlchemy)
- ✅ CORS configuration
- ✅ Environment variables for secrets
- ✅ Comprehensive audit logging

## 🚀 Deployment

### Production Settings

In `.env`:
```env
DEBUG=False
CORS_ORIGINS=https://yourdomain.com
DATABASE_URL=postgresql://...  # production database
```

### Docker Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📖 Additional Documentation

- [Full API Examples](../API_EXAMPLES.md)
- [Project Overview](../PROJECT_OVERVIEW.md)
- [Backend Fixes Log](../BACKEND_FIXES.md)

## 🐛 Troubleshooting

**Database connection error:**
```bash
# Check PostgreSQL is running
docker ps

# Check DATABASE_URL in .env
```

**Redis connection error:**
```bash
# Check Redis is running
redis-cli ping  # Should return PONG
```

**Import errors:**
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

## 📄 License

MIT License - See LICENSE file

---

**Part of:** [2FA Authentication System](../)  
**Main Repo:** [vibe-coding-projects](../../)
