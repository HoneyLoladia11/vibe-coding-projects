# GitHub Setup Guide

Как да качиш проекта в GitHub за проверка от Vibe Coding курса.

## 📋 Предварителни стъпки

### 1. Създай GitHub акаунт (ако нямаш)
- Отиди на https://github.com
- Кликни "Sign up"
- Създай акаунт

### 2. Инсталирай Git (ако нямаш)

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install git
```

**macOS:**
```bash
brew install git
```

**Windows:**
- Свали от https://git-scm.com/download/win
- Инсталирай с default настройки

### 3. Конфигурирай Git
```bash
git config --global user.name "Твоето Име"
git config --global user.email "your.email@example.com"
```

## 🚀 Качване на проекта в GitHub

### Метод 1: Чрез GitHub Website (Най-лесен)

#### Стъпка 1: Създай Repository
1. Влез в GitHub
2. Кликни на "+" в горния десен ъгъл
3. Избери "New repository"
4. Попълни:
   - **Repository name:** `vibe-coding-2fa`
   - **Description:** "Vibe Coding 2FA Project - FastAPI с Telegram 2FA"
   - **Visibility:** Public (за да може да се провери)
   - ❌ **НЕ** създавай README, .gitignore или License (вече ги имаш)
5. Кликни "Create repository"

#### Стъпка 2: Качи файловете от компютъра
```bash
# В директорията на проекта
cd vibe-coding-2fa

# Инициализирай Git (ако не е вече)
git init

# Добави всички файлове
git add .

# Направи първи commit
git commit -m "Initial commit: Vibe Coding 2FA Project"

# Добави remote repository (замени YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/vibe-coding-2fa.git

# Изпрати към GitHub
git branch -M main
git push -u origin main
```

### Метод 2: Чрез GitHub Desktop (Визуален интерфейс)

1. Свали GitHub Desktop от https://desktop.github.com
2. Инсталирай и влез с GitHub акаунт
3. Кликни "Add" → "Add existing repository"
4. Избери папката `vibe-coding-2fa`
5. Кликни "Publish repository"
6. Избери име и description
7. Ensure "Keep this code private" е **НЕИЗБРАНО**
8. Кликни "Publish repository"

## 📝 Важни стъпки ПРЕДИ качване

### 1. Провери .gitignore
Убеди се че `.gitignore` включва:
```
.env
__pycache__/
*.pyc
venv/
*.db
```

### 2. Изтрий чувствителна информация
```bash
# Провери дали .env НЕ Е в Git
git status

# Ако е добавен по грешка, премахни го
git rm --cached .env

# Commit промяната
git commit -m "Remove .env from tracking"
```

### 3. Провери дали всичко работи
```bash
# Тествай приложението локално
python test_api.py

# Провери документацията
# Отвори http://localhost:8000/docs
```

## 📤 Споделяне на линка

### За Vibe Coding проверка

След успешно качване:

1. **GitHub Repository URL:**
   ```
   https://github.com/YOUR_USERNAME/vibe-coding-2fa
   ```

2. **Изпрати този линк на преподавателя**

3. **Убеди се че repository е PUBLIC**

## 📋 Checklist преди подаване

- [ ] Repository е публичен (public)
- [ ] `.env` файлът НЕ е качен (само `.env.example`)
- [ ] Всички `.py` файлове са качени
- [ ] `requirements.txt` е актуален
- [ ] `README.md` е пълен и ясен
- [ ] Документацията е налична
- [ ] Няма hardcoded secrets/passwords
- [ ] `.gitignore` работи правилно

## 🎨 Подобри Repository-то

### Добави README badges (опционално)
В началото на `README.md`:

```markdown
![Python](https://img.shields.io/badge/python-3.9+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
```

### Добави Topics на Repository
1. Отвори твоя repository в GitHub
2. Кликни на ⚙️ Settings
3. Добави topics:
   - `fastapi`
   - `python`
   - `telegram-bot`
   - `2fa`
   - `authentication`
   - `postgresql`
   - `redis`

### Създай Release (опционално)
1. Кликни "Releases" в дясно
2. "Create a new release"
3. Tag version: `v1.0.0`
4. Title: "Initial Release - Vibe Coding 2FA"
5. Description: Кратко описание
6. Publish release

## 🔄 Актуализиране на кода

### Ако направиш промени след качване:

```bash
# Добави променените файлове
git add .

# Commit с описание
git commit -m "Fix: Описание на промяната"

# Push към GitHub
git push origin main
```

### За по-големи промени:

```bash
# Създай нов branch
git checkout -b feature/new-feature

# Направи промените
# ...

# Commit
git add .
git commit -m "Add: Нова функционалност"

# Push новия branch
git push origin feature/new-feature

# Създай Pull Request в GitHub
```

## 📸 Добави Screenshots (Опционално но препоръчително)

### 1. Създай папка за screenshots
```bash
mkdir docs/screenshots
```

### 2. Добави screenshots
- Swagger UI (`/docs`)
- API response примери
- Tool creation
- Admin panel API

### 3. Обнови README.md
```markdown
## Screenshots

### API Documentation
![Swagger UI](docs/screenshots/swagger-ui.png)

### Admin Panel Endpoints
![Admin Endpoints](docs/screenshots/admin-endpoints.png)
```

## 🐛 Troubleshooting

### "Permission denied (publickey)"
```bash
# Използвай HTTPS вместо SSH
git remote set-url origin https://github.com/YOUR_USERNAME/vibe-coding-2fa.git
```

### "Repository not found"
```bash
# Провери URL-а
git remote -v

# Промени ако е грешен
git remote set-url origin CORRECT_URL
```

### "Large files"
GitHub има лимит 100MB на файл. Ако имаш големи файлове:
```bash
# Добави ги в .gitignore
echo "large_file.db" >> .gitignore

# Премахни от Git history
git rm --cached large_file.db
git commit -m "Remove large file"
```

## 📧 Информация за подаване

### Какво да споделиш с преподавателя:

1. **GitHub Repository URL:**
   ```
   https://github.com/YOUR_USERNAME/vibe-coding-2fa
   ```

2. **Кратко описание:**
   ```
   Проект за Vibe Coding курс:
   - FastAPI backend
   - Telegram 2FA authentication
   - Role-based access control
   - Admin panel с одобрения
   - Redis caching
   - Audit logging
   ```

3. **Технологии:**
   - FastAPI
   - PostgreSQL + SQLAlchemy
   - Redis
   - Telegram Bot API
   - JWT + Bcrypt

4. **Основни функционалности:**
   - User registration/login
   - Telegram 2FA
   - Tool management (CRUD)
   - Admin approval system
   - Statistics & analytics
   - Audit logging

## ✅ Финален checklist

Преди да изпратиш линка:

- [ ] Кодът е качен в GitHub
- [ ] Repository е PUBLIC
- [ ] README.md е ясен и пълен
- [ ] API_EXAMPLES.md е налична
- [ ] QUICKSTART.md обяснява setup-а
- [ ] .env НЕ е качен
- [ ] requirements.txt е актуален
- [ ] Проектът работи локално
- [ ] Няма TODO коментари в кода
- [ ] Документацията е завършена

## 🎉 Готово!

Поздравления! Проектът ти е готов за проверка.

**Repository link template:**
```
https://github.com/YOUR_USERNAME/vibe-coding-2fa
```

**Успех с курса! 🚀**

---

## 📞 Контакти

Ако имаш въпроси:
- Провери документацията в README.md
- Прегледай QUICKSTART.md
- Създай Issue в GitHub repository
- Попитай преподавателя

**Happy Coding!** 💻
