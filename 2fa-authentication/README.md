# Vibe Coding 2FA Project

Модерна система за управление на инструменти с Telegram 2FA автентикация, role-based access control и админ панел.

## 🚀 Функционалности

### Автентикация и Сигурност
- ✅ User registration и login
- ✅ Telegram 2FA (двуфакторна автентикация)
- ✅ JWT токени за сесии
- ✅ Bcrypt хеширане на пароли
- ✅ Role-based access control (User, Moderator, Admin)

### Управление на Тулове
- ✅ Създаване на нови тулове
- ✅ Одобрение/отказ от moderators и admins
- ✅ Филтриране по категория, статус и автор
- ✅ Статистики и overview

### Админ Панел
- ✅ Списък на всички тулове с филтри
- ✅ Управление на потребители и роли
- ✅ Одобрение/отхвърляне на предложения
- ✅ Audit log - проследяване на всички действия

### Производителност
- ✅ Redis кеширане на категории и статистики
- ✅ Middleware за защита на route-ове според роли
- ✅ Audit logging за всички критични действия

## 📋 Технологии

- **Backend:** FastAPI
- **Database:** PostgreSQL + SQLAlchemy ORM
- **Cache:** Redis
- **2FA:** Telegram Bot API
- **Authentication:** JWT + Bcrypt
- **Migrations:** Alembic

## 🔧 Инсталация

### 1. Клонирай проекта

```bash
git clone https://github.com/your-username/vibe-coding-2fa.git
cd vibe-coding-2fa
```

### 2. Създай виртуална среда

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate  # Windows
```

### 3. Инсталирай зависимостите

```bash
pip install -r requirements.txt
```

### 4. Настрой PostgreSQL

```bash
# Влез в PostgreSQL
sudo -u postgres psql

# Създай база данни и потребител
CREATE DATABASE vibe_coding_db;
CREATE USER vibe_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE vibe_coding_db TO vibe_user;
\q
```

### 5. Настрой Redis

```bash
# Инсталирай Redis (Ubuntu/Debian)
sudo apt-get install redis-server

# Стартирай Redis
sudo systemctl start redis
sudo systemctl enable redis

# Провери дали работи
redis-cli ping  # Трябва да върне PONG
```

### 6. Създай Telegram Bot

1. Отвори Telegram и намери **@BotFather**
2. Изпрати `/newbot`
3. Следвай инструкциите и вземи **Bot Token**
4. За да получиш твоя Chat ID:
   - Изпрати съобщение на твоя бот
   - Посети: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Намери `chat.id` в JSON отговора

### 7. Конфигурирай Environment Variables

```bash
# Копирай примерния .env файл
cp .env.example .env

# Редактирай .env с твоите настройки
nano .env
```

Попълни следните стойности в `.env`:

```env
DATABASE_URL=postgresql://vibe_user:your_password@localhost:5432/vibe_coding_db
SECRET_KEY=your-super-secret-key-change-this
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 8. Създай Database Tables

```bash
# Използвай Alembic за миграции
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head

# Или директно с SQLAlchemy (за development)
# Tables ще се създадат автоматично при стартиране
```

## 🚀 Стартиране

### Development mode

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Или директно:

```bash
python app/main.py
```

### Production mode

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

API ще бъде достъпно на: `http://localhost:8000`

## 📚 API Документация

След стартиране, отвори браузър на:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## 🔐 Използване на API

### 1. Регистрация

```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepass123"
  }'
```

### 2. Login

```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "securepass123"
  }'
```

Отговор:
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "requires_2fa": false
}
```

### 3. Setup Telegram 2FA

```bash
curl -X POST "http://localhost:8000/api/auth/setup-telegram" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "telegram_chat_id": "YOUR_CHAT_ID"
  }'
```

### 4. Login с 2FA

Когато 2FA е активирано:

```bash
# 1. Login - ще получиш код по Telegram
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "securepass123"
  }'

# Response: requires_2fa: true

# 2. Verify code
curl -X POST "http://localhost:8000/api/auth/verify-2fa" \
  -H "Authorization: Bearer TEMP_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "123456"
  }'
```

### 5. Създай Tool

```bash
curl -X POST "http://localhost:8000/api/tools" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "VS Code",
    "description": "Powerful code editor from Microsoft",
    "category": "development",
    "url": "https://code.visualstudio.com"
  }'
```

### 6. Одобри Tool (Moderator/Admin)

```bash
curl -X POST "http://localhost:8000/api/admin/tools/1/approve" \
  -H "Authorization: Bearer MODERATOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "approved": true,
    "reason": "Great tool!"
  }'
```

## 👥 Роли и Permissions

### User
- Създава тулове
- Редактира собствените си тулове
- Вижда одобрени тулове

### Moderator
- Всички User permissions
- Одобрява/отхвърля тулове
- Вижда всички тулове
- Достъп до основни статистики

### Admin
- Всички Moderator permissions
- Управлява потребители
- Променя роли на потребители
- Пълен достъп до audit logs
- Достъп до всички админ функции

## 🗂️ Структура на Проекта

```
vibe-coding-2fa/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration
│   ├── database.py          # Database connection
│   ├── models/              # SQLAlchemy models
│   │   ├── user.py
│   │   ├── tool.py
│   │   └── audit_log.py
│   ├── schemas/             # Pydantic schemas
│   │   ├── user.py
│   │   └── tool.py
│   ├── routers/             # API endpoints
│   │   ├── auth.py
│   │   ├── tools.py
│   │   └── admin.py
│   ├── middleware/          # Auth middleware
│   │   └── auth.py
│   ├── services/            # Business logic
│   │   ├── telegram.py
│   │   ├── cache.py
│   │   └── audit.py
│   └── utils/               # Utility functions
│       └── security.py
├── alembic/                 # Database migrations
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```

## 🧪 Testing

### Създай тестов admin потребител

Можеш да създадеш admin потребител директно в базата:

```python
# create_admin.py
from app.database import SessionLocal
from app.models.user import User, UserRole
from app.utils.security import hash_password

db = SessionLocal()

admin = User(
    username="admin",
    email="admin@example.com",
    password_hash=hash_password("admin123"),
    role=UserRole.ADMIN
)

db.add(admin)
db.commit()
print("Admin user created!")
```

```bash
python create_admin.py
```

## 📊 Кеширане

Проектът използва Redis за:
- Кеширане на списъци с тулове (5 минути)
- Кеширане на статистики (5 минути)
- Съхраняване на 2FA кодове (5 минути)

За да изчистиш кеша:

```bash
redis-cli FLUSHALL
```

## 📝 Audit Logging

Всички критични действия се логват:
- User registration/login
- 2FA setup/verification
- Tool creation/update/deletion
- Tool approval/rejection
- Role changes

Вижте логовете през Admin API:

```bash
curl -X GET "http://localhost:8000/api/admin/audit-logs" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

## 🔒 Сигурност

- Пароли се хешират с bcrypt
- JWT токени с expiration
- 2FA кодове експирират след 5 минути
- Role-based access control на всички endpoint-и
- Audit logging за tracking

## 🐛 Troubleshooting

### Redis connection error
```bash
sudo systemctl status redis
sudo systemctl start redis
```

### Database connection error
```bash
# Провери PostgreSQL
sudo systemctl status postgresql

# Провери credentials в .env
```

### Telegram bot not sending messages
```bash
# Провери bot token
# Провери chat_id
# Увери се че си започнал разговор с бота
```

## 📄 License

MIT License

## 👨‍💻 Author

Vibe Coding Course Project

---

**Happy Coding! 🚀**
