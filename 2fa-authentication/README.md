# 🔐 2FA Authentication System with Telegram

A full-stack authentication system featuring Telegram-based Two-Factor Authentication (2FA), built with modern web technologies.

## 📋 Overview

This project implements a secure authentication system with Telegram-based 2FA verification. Users can register, log in, and enable 2FA through a Telegram bot for enhanced account security. The system includes a comprehensive tool management system with ratings, comments, and an admin panel.

## ✨ Features

### Authentication & Security
- 🔑 User registration and login
- 📱 Telegram-based Two-Factor Authentication (2FA)
- 🔒 Password hashing with bcrypt
- 🎫 JWT token-based authentication
- 👤 Role-based access control (User/Admin)

### Tool Management
- 📝 Create, read, update, and delete tools
- ⭐ Rating system for tools
- 💬 Comment system with threaded discussions
- 🔍 Search and filter capabilities
- 📊 Pagination support

### Admin Panel
- 👥 User management
- 🔨 Tool moderation
- 📈 System statistics and monitoring
- 🛡️ Enhanced security controls

### Telegram Integration
- 🤖 Custom Telegram bot for 2FA codes
- 🔐 Secure code generation (6-digit OTP)
- ⏱️ Time-limited verification codes (5 minutes)
- ✅ Chat ID verification

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Relational database
- **Redis** - Session management and caching
- **SQLAlchemy** - ORM for database operations
- **Alembic** - Database migrations
- **python-telegram-bot** - Telegram Bot API integration
- **Docker** - Containerization

### Frontend
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Router** - Client-side routing

## 📁 Project Structure

```
2fa-authentication/
├── backend/
│   ├── app/
│   │   ├── models/          # Database models (User, Tool, Rating, Comment, etc.)
│   │   ├── routers/         # API endpoints (auth, tools, admin, etc.)
│   │   ├── services/        # Business logic (telegram, audit, etc.)
│   │   ├── core/            # Configuration and security
│   │   └── main.py          # FastAPI application entry point
│   ├── alembic/             # Database migrations
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile           # Backend container configuration
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components (Login, Dashboard, Admin, etc.)
│   │   ├── services/        # API services
│   │   ├── contexts/        # React contexts (AuthContext)
│   │   └── App.tsx          # Main application component
│   ├── package.json         # Node dependencies
│   └── vite.config.ts       # Vite configuration
├── docker-compose.yml       # Multi-container orchestration
├── .env                     # Environment variables
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose
- Telegram Bot Token (from [@BotFather](https://t.me/BotFather))

### Environment Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd 2fa-authentication
```

2. **Create `.env` file in the project root**
```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=auth_db

# Redis
REDIS_PASSWORD=your_redis_password

# Backend
DATABASE_URL=postgresql://postgres:your_secure_password@db:5432/auth_db
SECRET_KEY=your_jwt_secret_key_here_min_32_chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# CORS (Frontend URL)
ALLOWED_ORIGINS=http://localhost:5173
```

3. **Get Telegram Bot Token**
   - Message [@BotFather](https://t.me/BotFather) on Telegram
   - Send `/newbot` and follow instructions
   - Copy the token to your `.env` file

### Installation & Running

**Start all services with Docker Compose:**
```bash
docker-compose up -d
```

This will start:
- PostgreSQL (port 5432)
- Redis (port 6379)
- Backend API (port 8000)
- Frontend (port 5173)

**Access the application:**
- Frontend: http://localhost:8080
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Database Migrations

The database is automatically initialized on first run. To manually run migrations:

```bash
# Enter the backend container
docker exec -it 2fa-backend bash

# Run migrations
alembic upgrade head
```

## 📱 Telegram 2FA Setup

1. **Register an account** on the platform
2. **Start your Telegram bot** by searching for your bot name in Telegram and clicking "Start"
3. **Enable 2FA** in your account settings:
   - Navigate to profile/settings
   - Click "Enable 2FA"
   - Your Telegram Chat ID will be automatically linked
4. **Login with 2FA**:
   - Enter your credentials
   - You'll receive a 6-digit code via Telegram
   - Enter the code to complete login (code expires in 5 minutes)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (returns 2FA required if enabled)
- `POST /api/auth/verify-2fa` - Verify 2FA code
- `GET /api/auth/me` - Get current user
- `POST /api/auth/enable-2fa` - Enable Telegram 2FA
- `POST /api/auth/disable-2fa` - Disable 2FA

### Tools
- `GET /api/tools` - List tools (with pagination and filters)
- `POST /api/tools` - Create tool (authenticated)
- `GET /api/tools/{id}` - Get tool details
- `PUT /api/tools/{id}` - Update tool (owner only)
- `DELETE /api/tools/{id}` - Delete tool (owner/admin)

### Ratings
- `POST /api/tools/{id}/ratings` - Rate a tool
- `GET /api/tools/{id}/ratings` - Get tool ratings
- `PUT /api/tools/{id}/ratings/{rating_id}` - Update rating
- `DELETE /api/tools/{id}/ratings/{rating_id}` - Delete rating

### Comments
- `POST /api/tools/{id}/comments` - Add comment
- `GET /api/tools/{id}/comments` - Get comments
- `PUT /api/comments/{id}` - Update comment
- `DELETE /api/comments/{id}` - Delete comment

### Admin
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/{id}/role` - Change user role
- `DELETE /api/admin/users/{id}` - Delete user
- `GET /api/admin/tools` - List all tools (admin view)
- `GET /api/admin/stats` - System statistics

## 🔒 Security Features

- **Password Security**: Bcrypt hashing with salt
- **JWT Authentication**: Secure token-based auth
- **2FA**: Telegram-based two-factor authentication
- **CORS Protection**: Configurable allowed origins
- **Input Validation**: Pydantic models for request validation
- **SQL Injection Protection**: SQLAlchemy ORM with parameterized queries
- **Rate Limiting**: Redis-based session management

## 🧪 Testing

The system has been tested with:
- User registration and login flows
- Telegram 2FA enablement and verification
- Tool CRUD operations
- Rating and comment functionality
- Admin panel operations

## 📝 Development Notes

### Recent Fixes
- ✅ Fixed API/Frontend response format sync (tools, comments return {data, total})
- ✅ Fixed database schema issues (enums, foreign keys, nullable fields)
- ✅ Fixed search functionality
- ✅ Implemented proper Alembic migrations (removed create_all())
- ✅ Moved sensitive config to .env file
- ✅ Fixed Tool rating display on Dashboard and My Tools
- ✅ Fixed comments creation and retrieval
- ✅ Fixed 2FA Telegram integration
- ✅ Fixed Admin panel (statistics, approve/reject tools, user management)
- ✅ Fixed password change functionality
- ✅ Added input validation for comments (min 10 chars) and tool description
- ✅ Fixed login error messages

### Key Components
- **Authentication Flow**: Register → Login → (2FA if enabled) → JWT Token
- **Telegram Integration**: Bot sends OTP codes with 5-minute expiration
- **Database Models**: User, Tool, Rating, Comment, AuditLog
- **Role System**: User (default) and Admin roles

## 🚧 Future Enhancements

- [ ] Email notifications
- [ ] Password reset functionality
- [ ] Advanced search and filtering
- [ ] File upload for tool images
- [ ] Real-time notifications with WebSockets
- [ ] Rate limiting for API endpoints
- [ ] Enhanced audit logging
- [ ] Mobile app support

## 📄 License

This project is part of a coding portfolio and is available for educational purposes.

## 👨‍💻 Author

**Yoan** - [GitHub](https://github.com/yoan9601)

---

**Built with ❤️ using FastAPI, React, and Telegram**
