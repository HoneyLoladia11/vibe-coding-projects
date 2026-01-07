# 2FA Authentication System 🔐

Full-stack authentication system with Telegram 2FA, role-based access control, ratings & comments, and comprehensive admin panel.

**Live Demo:** [Coming Soon]  
**API Docs:** http://localhost:8000/docs (when running locally)

---

## 🎯 Overview

A production-ready authentication and tool management platform featuring:
- **Telegram 2FA** for secure login
- **Role-based access** (User, Moderator, Admin)
- **Tool management** with approval workflow
- **Ratings & Comments** system with voting
- **Admin dashboard** with statistics
- **Modern React UI** with dark mode support

Built as part of the **Vibe Coding** course to demonstrate enterprise-grade architecture and best practices.

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.9+**
- **Node.js 16+**
- **PostgreSQL 15**
- **Redis 7**
- **Docker** (optional but recommended)

### Option 1: Docker (Fastest)

```bash
# Clone the repo
cd 2fa-authentication

# Start everything
docker-compose up
```

**Backend:** http://localhost:8000  
**Frontend:** http://localhost:5173  
**API Docs:** http://localhost:8000/docs

### Option 2: Manual Setup

#### Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your settings

# Run migrations
alembic upgrade head

# Create admin user
python create_admin.py

# Start backend
uvicorn app.main:app --reload
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start frontend
npm run dev
```

---

## 📁 Project Structure

```
2fa-authentication/
├── README.md                           # This file
├── backend/                            # FastAPI Backend
│   ├── app/
│   │   ├── main.py                     # Application entry point
│   │   ├── routers/                    # API endpoints
│   │   │   ├── auth.py                 # Authentication & 2FA
│   │   │   ├── tools.py                # Tool CRUD operations
│   │   │   ├── admin.py                # Admin panel endpoints
│   │   │   └── ratings_comments.py     # Ratings & Comments
│   │   ├── models/                     # SQLAlchemy models
│   │   │   ├── user.py
│   │   │   ├── tool.py
│   │   │   ├── tool_rating.py
│   │   │   └── tool_comment.py
│   │   ├── schemas/                    # Pydantic schemas
│   │   ├── services/                   # Business logic
│   │   │   ├── telegram.py             # Telegram 2FA service
│   │   │   ├── cache.py                # Redis caching
│   │   │   └── audit.py                # Audit logging
│   │   ├── middleware/                 # Auth middleware
│   │   └── utils/                      # Helper functions
│   ├── requirements.txt
│   ├── docker-compose.yml
│   └── README.md                       # Backend-specific docs
└── frontend/                           # React Frontend
    ├── src/
    │   ├── App.tsx                     # Main app component
    │   ├── pages/                      # Page components
    │   │   ├── Login.tsx
    │   │   ├── Dashboard.tsx
    │   │   ├── ToolDetails.tsx
    │   │   ├── AdminPanel.tsx
    │   │   └── Profile.tsx
    │   ├── components/                 # Reusable components
    │   │   ├── auth/
    │   │   ├── ui/                     # Shadcn/UI components
    │   │   └── StarRating.tsx
    │   ├── contexts/                   # React contexts
    │   │   ├── AuthContext.tsx
    │   │   └── ThemeContext.tsx
    │   └── lib/
    │       └── api.ts                  # API client
    ├── package.json
    ├── vite.config.ts
    └── README.md                       # Frontend-specific docs
```

---

## ✨ Features

### 🔐 Authentication & Security
- **Telegram 2FA** - Secure two-factor authentication via Telegram Bot
- **JWT Tokens** - Stateless authentication with 30-minute expiration
- **Password Hashing** - Bcrypt with salt
- **Role-Based Access** - Three permission levels (User, Moderator, Admin)
- **Session Management** - Automatic logout on token expiry
- **Audit Logging** - Complete activity tracking

### 🛠️ Tool Management
- **CRUD Operations** - Create, read, update, delete tools
- **Approval Workflow** - Moderators approve/reject submissions
- **Categories** - Development, Design, Productivity, Communication, Analytics, Other
- **Status Tracking** - Pending, Approved, Rejected
- **Search & Filter** - By category, status, keyword
- **Pagination** - Efficient data loading

### ⭐ Ratings & Comments
- **5-Star Ratings** - Users rate tools (1-5 stars)
- **Rating Statistics** - Average rating, total ratings, distribution
- **Comments** - Users can review and discuss tools
- **Comment Voting** - Upvote/downvote comments
- **Edit & Delete** - Users manage their own content
- **Moderation** - Moderators can remove inappropriate content

### 👨‍💼 Admin Panel
- **Pending Tools** - Review and approve submissions
- **User Management** - View users, change roles (Admin only)
- **Statistics Dashboard** - Users by role, tools by status/category
- **Activity Log** - Recent actions and changes
- **Charts & Graphs** - Visual data representation with Recharts

### 🎨 Modern UI/UX
- **Dark/Light Mode** - User preference toggle
- **Responsive Design** - Mobile, tablet, desktop support
- **Loading States** - Skeleton loaders and spinners
- **Error Handling** - Clear error messages and recovery
- **Toast Notifications** - Success/error feedback
- **Smooth Animations** - Tailwind CSS animations

---

## 🔌 API Endpoints

### Authentication (`/api/auth/`)
- `POST /register` - Create new account
- `POST /login` - Login with username/password
- `POST /verify-2fa` - Verify 2FA code
- `POST /enable-2fa` - Enable Telegram 2FA
- `POST /disable-2fa` - Disable 2FA
- `POST /test-2fa` - Test 2FA setup
- `POST /change-password` - Change password
- `GET /me` - Get current user info

### Tools (`/api/tools/`)
- `GET /` - List tools (with filters & pagination)
- `POST /` - Create new tool
- `GET /{id}` - Get tool details
- `PUT /{id}` - Update tool
- `DELETE /{id}` - Delete tool
- `GET /my` - Get my tools

### Ratings (`/api/tools/{id}/`)
- `POST /rate` - Rate a tool (1-5 stars)
- `GET /my-rating` - Get my rating for this tool
- `GET /ratings/stats` - Get rating statistics
- `GET /ratings` - List all ratings
- `DELETE /rate` - Delete my rating

### Comments (`/api/tools/{id}/comments/`)
- `POST /` - Add comment
- `GET /` - List comments (paginated)
- `PUT /{comment_id}` - Update comment
- `DELETE /{comment_id}` - Delete comment
- `POST /{comment_id}/vote` - Vote on comment (up/down)
- `DELETE /{comment_id}/vote` - Remove vote

### Admin (`/api/admin/`)
- `GET /tools/pending` - Get pending tools
- `POST /tools/{id}/approve` - Approve tool
- `POST /tools/{id}/reject` - Reject tool (with reason)
- `GET /users` - List all users
- `PUT /users/{id}/role` - Change user role
- `GET /statistics` - Get dashboard statistics

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **FastAPI** | High-performance web framework |
| **SQLAlchemy** | ORM for database operations |
| **Alembic** | Database migration management |
| **PostgreSQL** | Primary relational database |
| **Redis** | Caching and session storage |
| **Pydantic** | Data validation and schemas |
| **python-jose** | JWT token handling |
| **passlib** | Password hashing (Bcrypt) |
| **python-telegram-bot** | Telegram Bot API integration |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type-safe JavaScript |
| **Vite** | Fast build tool |
| **React Router** | Client-side routing |
| **TanStack Query** | Data fetching & caching |
| **Tailwind CSS** | Utility-first CSS framework |
| **Shadcn/UI** | Beautiful component library |
| **Recharts** | Chart visualization |
| **Lucide React** | Icon library |

---

## 🔒 Security Features

- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Bcrypt Password Hashing** - Industry-standard hashing
- ✅ **2FA via Telegram** - Additional security layer
- ✅ **CORS Configuration** - Controlled cross-origin access
- ✅ **SQL Injection Protection** - SQLAlchemy ORM
- ✅ **XSS Protection** - React's built-in sanitization
- ✅ **Environment Variables** - No hardcoded secrets
- ✅ **Role-Based Authorization** - Granular access control
- ✅ **Audit Logging** - Complete action history
- ✅ **Token Expiration** - 30-minute JWT lifetime
- ✅ **Password Complexity** - Minimum requirements enforced

---

## 📊 Database Schema

### Users
- Authentication credentials
- Role (User, Moderator, Admin)
- 2FA settings (Telegram chat ID)
- Created date

### Tools
- Name, description, category, URL
- Status (Pending, Approved, Rejected)
- Creator and approver references
- Timestamps

### Tool Ratings
- User-tool relationship
- Rating value (1-5)
- Timestamps
- Unique constraint (one rating per user per tool)

### Tool Comments
- Comment text
- User-tool relationship
- Upvote/downvote counts
- Timestamps

### Comment Votes
- User-comment relationship
- Vote type (upvote/downvote)
- Unique constraint (one vote per user per comment)

### Audit Logs
- User action tracking
- Entity type and ID
- Action details
- Timestamp

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
python test_api.py
```

### Frontend Tests
```bash
cd frontend
npm run test
```

### Manual Testing
1. Start both backend and frontend
2. Register a new account
3. Enable 2FA via Telegram
4. Create a tool
5. Rate and comment on tools
6. Test admin panel (if admin)

---

## 📈 Performance Optimizations

- **Redis Caching** - 5-minute TTL for frequently accessed data
- **Database Indexing** - Optimized queries on foreign keys
- **Pagination** - Efficient data loading
- **Code Splitting** - React lazy loading
- **Asset Optimization** - Vite build optimization
- **API Response Compression** - Gzip compression
- **Connection Pooling** - SQLAlchemy pool management

---

## 🚀 Deployment

### Backend Deployment
- **Docker** - Containerized deployment
- **Railway/Render** - Platform-as-a-Service options
- **AWS/Azure/GCP** - Cloud infrastructure
- **Environment Variables** - Configure via platform settings

### Frontend Deployment
- **Vercel** - Recommended for React/Vite
- **Netlify** - Alternative option
- **GitHub Pages** - Static hosting
- **Cloudflare Pages** - Edge deployment

### Environment Variables
Ensure these are set in production:
- `DATABASE_URL` - Production database
- `REDIS_URL` - Production Redis instance
- `JWT_SECRET_KEY` - Strong random secret
- `TELEGRAM_BOT_TOKEN` - Bot token
- `CORS_ORIGINS` - Frontend domain

---

## 📖 Documentation

- **[Backend README](./backend/README.md)** - Backend setup and API details
- **[Frontend README](./frontend/README.md)** - Frontend setup and components
- **[API Examples](./backend/API_EXAMPLES.md)** - curl examples for all endpoints
- **[Project Overview](./backend/PROJECT_OVERVIEW.md)** - Technical deep dive

---

## 🎓 What I Learned

### Technical Skills
- Building production-ready REST APIs with FastAPI
- Implementing secure 2FA authentication flows
- Designing role-based access control systems
- Using Redis for caching and performance
- Database modeling and migrations with Alembic
- Modern React patterns (Hooks, Context, Custom Hooks)
- TypeScript for type-safe frontend development
- Component-based architecture with Shadcn/UI
- State management with TanStack Query

### Software Engineering
- Clean code architecture and SOLID principles
- Separation of concerns (Services, Routers, Models)
- RESTful API design best practices
- Security best practices (authentication, authorization, data protection)
- Error handling and validation
- API documentation with OpenAPI/Swagger
- Git workflow and version control
- Docker containerization

---

## 🐛 Known Issues & Future Improvements

### Current Limitations
- Comment `user_vote` tracking not fully implemented
- No email notifications for events
- Single bot token (not multi-tenant)
- Basic search (no full-text search)

### Future Enhancements
- [ ] Email 2FA alternative
- [ ] OAuth integration (Google, GitHub)
- [ ] Advanced search with Elasticsearch
- [ ] Real-time notifications (WebSocket)
- [ ] Tool analytics and insights
- [ ] User profiles with avatars
- [ ] Tool collections/favorites
- [ ] Export data functionality
- [ ] Multi-language support
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

This is a learning project, but suggestions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

## 📫 Contact

**Developer:** Yoan  
**GitHub:** [@yoan9601](https://github.com/yoan9601)  
**Course:** Vibe Coding  
**Year:** 2026  

---

## 🙏 Acknowledgments

- **Vibe Coding** - For the excellent course structure
- **FastAPI** - Amazing Python web framework
- **Shadcn/UI** - Beautiful component library
- **Lovable.dev** - AI-powered frontend generation
- **Anthropic Claude** - AI assistance in development

---

<div align="center">

**Built with ❤️ and ☕ during Vibe Coding Course**

⭐ **Star this repo if you find it helpful!**

[🏠 Back to Portfolio](../) | [📖 Backend Docs](./backend/) | [🎨 Frontend Docs](./frontend/)

</div>
