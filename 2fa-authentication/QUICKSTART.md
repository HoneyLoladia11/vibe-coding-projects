# Quick Start Guide

Бърз старт за Vibe Coding 2FA проект - от нула до работещо API за 10 минути! ⚡

## Предпоставки

- Python 3.9+
- Docker & Docker Compose (препоръчително)
- Git

## Метод 1: С Docker (Най-лесен) 🐳

### 1. Клонирай проекта
```bash
git clone https://github.com/your-username/vibe-coding-2fa.git
cd vibe-coding-2fa
```

### 2. Създай .env файл
```bash
cp .env.example .env
```

Редактирай `.env` и добави поне:
```env
SECRET_KEY=your-random-secret-key-here
TELEGRAM_BOT_TOKEN=your-telegram-bot-token  # optional за начало
```

### 3. Стартирай всичко
```bash
# Стартирай PostgreSQL и Redis
docker-compose up -d

# Създай виртуална среда и инсталирай
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt

# Стартирай приложението
./run.sh
```

### 4. Готово! 🎉
API е достъпно на: http://localhost:8000
Документация: http://localhost:8000/docs

## Метод 2: Без Docker (Ръчна настройка) 🔧

### 1. Инсталирай PostgreSQL
```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Инсталирай Redis
```bash
# Ubuntu/Debian
sudo apt-get install redis-server

# Start service
sudo systemctl start redis
sudo systemctl enable redis
```

### 3. Създай database
```bash
sudo -u postgres psql
```

В PostgreSQL shell:
```sql
CREATE DATABASE vibe_coding_db;
CREATE USER vibe_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE vibe_coding_db TO vibe_user;
\q
```

### 4. Setup проекта
```bash
git clone https://github.com/your-username/vibe-coding-2fa.git
cd vibe-coding-2fa

# Създай .env
cp .env.example .env
nano .env  # Редактирай с твоите настройки

# Virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Migrations
alembic upgrade head

# Стартирай
python app/main.py
```

## Първи стъпки

### 1. Създай Admin потребител
```bash
python create_admin.py
```

Ще получиш:
```
✅ Admin user created successfully!
   Username: admin
   Email: admin@example.com
   Password: admin123
```

### 2. Тествай API
```bash
# В друг терминал
python test_api.py
```

### 3. Login като Admin
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

Вземи `access_token` от отговора.

### 4. Създай първи tool
```bash
curl -X POST "http://localhost:8000/api/tools" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "VS Code",
    "description": "Popular code editor",
    "category": "development",
    "url": "https://code.visualstudio.com"
  }'
```

## Setup Telegram 2FA (Опционално)

### 1. Създай Telegram Bot
1. Отвори Telegram
2. Намери **@BotFather**
3. Изпрати `/newbot`
4. Следвай инструкциите
5. Копирай Bot Token

### 2. Намери твоя Chat ID
1. Изпрати съобщение на твоя бот
2. Посети в браузър:
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```
3. Намери `"chat":{"id":123456789}` в JSON

### 3. Добави в .env
```env
TELEGRAM_BOT_TOKEN=your-bot-token-here
```

### 4. Setup 2FA за потребител
```bash
curl -X POST "http://localhost:8000/api/auth/setup-telegram" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"telegram_chat_id": "YOUR_CHAT_ID"}'
```

### 5. Тествай 2FA Login
```bash
# Login - ще получиш код в Telegram
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

# Verify кода
curl -X POST "http://localhost:8000/api/auth/verify-2fa" \
  -H "Authorization: Bearer TEMP_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code": "123456"}'
```

## Често използвани команди

```bash
# Стартирай приложението
python app/main.py
# или
./run.sh

# Стартирай с reload (development)
uvicorn app.main:app --reload

# Създай миграция
alembic revision --autogenerate -m "Description"

# Приложи миграции
alembic upgrade head

# Rollback миграция
alembic downgrade -1

# Тествай API
python test_api.py

# Създай admin
python create_admin.py

# Провери Redis
redis-cli ping

# Провери PostgreSQL
psql -U vibe_user -d vibe_coding_db
```

## Проверка на services

```bash
# PostgreSQL
sudo systemctl status postgresql

# Redis
sudo systemctl status redis

# Или с Docker
docker-compose ps
```

## API Endpoints Overview

### Public
- `GET /` - Root
- `GET /health` - Health check
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login

### Authenticated
- `GET /api/auth/me` - Get user info
- `POST /api/auth/setup-telegram` - Setup 2FA
- `POST /api/tools` - Create tool
- `GET /api/tools` - List tools
- `GET /api/tools/my/tools` - My tools

### Moderator/Admin
- `GET /api/admin/tools/pending` - Pending tools
- `POST /api/admin/tools/{id}/approve` - Approve/reject

### Admin Only
- `GET /api/admin/users` - List users
- `PUT /api/admin/users/{id}/role` - Change role
- `GET /api/admin/audit-logs` - View logs

## Troubleshooting

### Port 8000 already in use
```bash
# Намери процеса
lsof -i :8000

# Убий го
kill -9 <PID>
```

### Database connection error
```bash
# Провери PostgreSQL
sudo systemctl status postgresql
sudo systemctl start postgresql

# Провери .env DATABASE_URL
```

### Redis connection error
```bash
# Провери Redis
sudo systemctl status redis
sudo systemctl start redis

# Тествай
redis-cli ping  # Should return PONG
```

### Import errors
```bash
# Инсталирай dependencies отново
pip install -r requirements.txt --upgrade
```

## Next Steps

1. ✅ Прочети пълната документация в `README.md`
2. ✅ Разгледай API примерите в `API_EXAMPLES.md`
3. ✅ Експериментирай с различни endpoints в Swagger UI
4. ✅ Създай модератор потребител и тествай approval flow
5. ✅ Setup Telegram 2FA и тествай security

## Полезни линкове

- 📚 API Docs: http://localhost:8000/docs
- 📖 ReDoc: http://localhost:8000/redoc
- 🐙 GitHub: https://github.com/your-username/vibe-coding-2fa
- 💬 Telegram Bot: @BotFather

---

**Готов си! Happy Coding! 🚀**
