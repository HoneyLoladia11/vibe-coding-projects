# Development Prompts for AI Agents

Ready-to-use prompts for continuing development of this project with AI assistance.

## 🚀 Getting Started Prompts

### **Initial Context Prompt**
```
I'm working on a FastAPI authentication system with the following architecture:

Tech Stack:
- FastAPI 0.109.0
- PostgreSQL 15 + SQLAlchemy
- Redis 7 for caching
- JWT authentication
- Telegram Bot API for 2FA

Current Structure:
- app/models/ - Database models (User, Tool, AuditLog)
- app/schemas/ - Pydantic schemas
- app/routers/ - API endpoints (auth, tools, admin)
- app/services/ - Business logic (telegram, cache, audit)
- app/middleware/ - Authentication middleware
- app/utils/ - Helper functions

Features Implemented:
✅ User registration/login
✅ Telegram 2FA
✅ Role-based access (User, Moderator, Admin)
✅ Tool management with approval workflow
✅ Redis caching
✅ Audit logging

I need help with [YOUR_TASK_HERE].
```

---

## 🔧 Feature Addition Prompts

### **1. Add Email 2FA**
```
Add email-based 2FA as an alternative to Telegram 2FA in the existing system.

Requirements:
1. User can choose between Telegram or Email 2FA
2. Email service similar to TelegramService
3. Use same Redis caching pattern for codes
4. Add email field validation in schemas
5. Update User model with email_2fa_enabled flag
6. Create setup-email and verify-email endpoints
7. Use SMTP for sending (configurable in .env)

Please provide:
- Updated User model
- EmailService class (app/services/email.py)
- New Pydantic schemas
- Router modifications
- Environment variable examples
- Documentation updates
```

### **2. Add Tool Ratings & Comments**
```
Implement a rating and comment system for tools.

Requirements:
1. Users can rate tools 1-5 stars (one rating per user per tool)
2. Users can comment on tools (multiple comments allowed)
3. Comments can be upvoted/downvoted
4. Moderators can delete inappropriate comments
5. Show average rating and total reviews on tool
6. Cache rating statistics

Please provide:
- New database models (ToolRating, ToolComment, CommentVote)
- Pydantic schemas for requests/responses
- Service class for ratings/comments logic
- Router endpoints (CRUD operations)
- Caching strategy
- Migration script (Alembic)
```

### **3. Add Advanced Search**
```
Implement full-text search with filters and sorting.

Requirements:
1. Search in tool name, description, tags
2. Filter by category, status, rating range
3. Sort by: relevance, date, rating, popularity
4. Pagination with page size control
5. Cache search results
6. Return total count and filtered results

Use PostgreSQL full-text search (not Elasticsearch for simplicity).

Please provide:
- Database indexes for performance
- Search service implementation
- Updated router with search endpoint
- Query building logic
- Caching strategy
- API documentation examples
```

### **4. Add User Profiles**
```
Create user profile system with public/private information.

Requirements:
1. UserProfile model (bio, avatar_url, website, skills)
2. Public profiles viewable by anyone
3. Private information (email) only visible to user
4. Profile editing endpoint (auth required)
5. Upload avatar via base64 or URL
6. Show user's contributed tools count
7. Activity timeline (recent actions from audit log)

Please provide:
- UserProfile model
- Schemas for create/update/response
- Router endpoints (get, update)
- Privacy filtering logic
- Integration with existing User model
```

---

## 🐛 Debugging Prompts

### **Generic Bug Report**
```
I'm experiencing [ISSUE] when [ACTION].

Error message:
[PASTE ERROR HERE]

Relevant code:
[PASTE CODE]

Environment:
- FastAPI 0.109.0
- PostgreSQL 15
- Redis 7
- Python 3.9+

Steps to reproduce:
1. [Step 1]
2. [Step 2]
3. [Error occurs]

Expected behavior:
[What should happen]

Actual behavior:
[What actually happens]

Please help diagnose and fix this issue.
```

### **Authentication Issue**
```
Users are getting 401 Unauthorized when trying to access protected endpoints.

Current flow:
1. User logs in → receives JWT token
2. User makes request with Authorization: Bearer <token>
3. Gets 401 error

Token generation code:
[PASTE create_access_token function]

Auth dependency code:
[PASTE get_current_user function]

What's wrong and how do I fix it?
```

### **Database Connection Issue**
```
Application fails to connect to PostgreSQL with error:
[PASTE ERROR]

Configuration:
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

Database status:
- PostgreSQL is running
- Can connect via psql
- Credentials are correct

sqlalchemy.create_engine code:
[PASTE CODE]

Why can't SQLAlchemy connect?
```

### **Redis Caching Not Working**
```
Cache reads/writes are failing silently.

CacheService implementation:
[PASTE CacheService CODE]

Usage:
cache_service.set("tools:list", data, expire=300)
result = cache_service.get("tools:list")  # Returns None

Redis status:
- redis-cli ping returns PONG
- Can manually SET/GET via redis-cli

What's the issue?
```

---

## 🔒 Security Review Prompts

### **General Security Audit**
```
Review this code for security vulnerabilities and best practices:

[PASTE CODE]

Focus on:
1. SQL injection risks
2. Authentication/authorization issues
3. Input validation
4. Sensitive data exposure
5. Error information leakage

Provide specific recommendations for improvements.
```

### **Authentication Flow Review**
```
Review the complete authentication flow for security issues:

Login endpoint:
[PASTE CODE]

2FA verification:
[PASTE CODE]

Token creation:
[PASTE CODE]

Current user extraction:
[PASTE CODE]

Questions:
1. Are there any security vulnerabilities?
2. Is the 2FA implementation secure?
3. Are tokens properly validated?
4. Any timing attack risks?
5. Recommendations for improvement?
```

---

## ⚡ Performance Optimization Prompts

### **Database Query Optimization**
```
This query is slow with 10,000+ tools:

[PASTE QUERY CODE]

Current execution time: ~2 seconds
Expected: <200ms

Tables:
- tools (10,000 rows)
- users (1,000 rows)

Indexes:
[LIST CURRENT INDEXES]

How can I optimize this?
```

### **Caching Strategy Review**
```
Review and optimize the caching strategy:

Current implementation:
[PASTE CACHING CODE]

Questions:
1. Is the cache key structure optimal?
2. Is TTL appropriate?
3. When should cache be invalidated?
4. Are we caching the right things?
5. Any memory concerns with current approach?

Suggest improvements.
```

### **API Response Time**
```
The /api/tools endpoint is slow:

Current implementation:
[PASTE CODE]

Performance stats:
- 1000 tools in database
- Average response time: 800ms
- Goal: <200ms

What's causing slowness and how to fix?
```

---

## 📝 Documentation Prompts

### **Generate API Documentation**
```
Generate OpenAPI/Swagger documentation for this endpoint:

[PASTE ENDPOINT CODE]

Include:
- Description
- Request body schema
- Response schemas (success and errors)
- Authentication requirements
- Example requests/responses
- Possible error codes
```

### **Write Docstrings**
```
Add comprehensive docstrings to this code:

[PASTE CODE]

Follow Google docstring format with:
- Function description
- Args with types
- Returns with type
- Raises (exceptions)
- Examples
```

### **Create Tutorial**
```
Write a step-by-step tutorial for:
"How to add a new tool using the API"

Include:
1. Authentication process
2. Tool creation request
3. Response handling
4. Error scenarios
5. Full curl examples
6. Expected outcomes
```

---

## 🧪 Testing Prompts

### **Generate Unit Tests**
```
Write pytest unit tests for this service:

[PASTE SERVICE CODE]

Requirements:
- Test all methods
- Mock external dependencies (database, Redis, Telegram)
- Cover success and error cases
- Use fixtures for common setup
- Aim for 90%+ coverage

Provide complete test file with all imports.
```

### **Generate Integration Tests**
```
Write integration tests for the authentication flow:

Flow to test:
1. Register user
2. Login (without 2FA)
3. Setup Telegram 2FA
4. Login with 2FA
5. Verify code
6. Access protected endpoint

Use TestClient from FastAPI.
Provide complete test file.
```

### **Generate API Tests**
```
Create API tests for all /api/tools endpoints:

Endpoints:
- GET /api/tools (list)
- POST /api/tools (create)
- GET /api/tools/{id} (get one)
- PUT /api/tools/{id} (update)
- DELETE /api/tools/{id} (delete)

Test:
- Success cases
- Authentication required
- Authorization (roles)
- Validation errors
- Not found errors
```

---

## 🔄 Refactoring Prompts

### **Extract to Service**
```
This router has too much business logic:

[PASTE ROUTER CODE]

Extract business logic to a service class following the pattern:
- app/services/[service_name].py
- Keep router thin (only request/response handling)
- Service methods should be testable independently
- Use dependency injection

Provide refactored router and new service.
```

### **Apply Repository Pattern**
```
Convert this direct database access to repository pattern:

Current code:
[PASTE CODE WITH DB QUERIES]

Create:
- Repository interface
- Repository implementation
- Update service to use repository
- Keep same functionality

Benefits should include:
- Easier testing (mock repository)
- Cleaner separation of concerns
- Reusable queries
```

### **Improve Error Handling**
```
This code has poor error handling:

[PASTE CODE]

Improve by:
1. Create custom exception classes
2. Add proper try-catch blocks
3. Return meaningful error messages
4. Log errors appropriately
5. Use HTTP status codes correctly

Provide refactored code with custom exceptions.
```

---

## 🎨 UI/UX Prompts (for frontend)

### **Generate Frontend Component**
```
Create a React component for tool rating:

Requirements:
- 5-star rating display (read-only and editable)
- Shows average rating and count
- Click to rate (if user is logged in)
- Calls API: POST /api/tools/{id}/rate
- Handles loading and error states
- Uses Tailwind CSS for styling

Provide complete React component.
```

### **Create Login Form**
```
Create a login form component with 2FA support:

Flow:
1. Username/password input
2. Submit → if 2FA required, show code input
3. Enter 6-digit code
4. Submit → redirect to dashboard

Features:
- Form validation
- Error display
- Loading states
- Remember me checkbox
- Forgot password link

Use React + Tailwind CSS.
```

---

## 📊 Analytics & Monitoring Prompts

### **Add Logging**
```
Add structured logging to this endpoint:

[PASTE CODE]

Requirements:
- Log request start/end
- Log user ID and action
- Log response status
- Log execution time
- Use Python logging module
- Include correlation ID for tracing

Format: JSON for easy parsing
```

### **Create Monitoring Endpoint**
```
Create /health and /metrics endpoints:

/health should return:
- Database connection status
- Redis connection status
- Telegram bot status
- Overall health (healthy/unhealthy)

/metrics should return:
- Total users count
- Total tools count
- Active sessions count
- Cache hit rate
- Average response time (last hour)

Provide implementation with caching.
```

---

## 🚢 Deployment Prompts

### **Dockerize Application**
```
Create Dockerfile and docker-compose.yml for this application.

Requirements:
- Multi-stage build for smaller image
- Production-ready (not development server)
- Include PostgreSQL and Redis services
- Health checks for all services
- Environment variables properly handled
- Volume mounts for persistence

Provide:
- Dockerfile
- docker-compose.yml
- .dockerignore
- Deployment instructions
```

### **CI/CD Pipeline**
```
Create GitHub Actions workflow for:

On push to main:
1. Run tests
2. Check code quality (flake8, black)
3. Build Docker image
4. Push to Docker Hub
5. Deploy to production (optional)

On pull request:
1. Run tests
2. Check code quality
3. Comment results on PR

Provide .github/workflows/ci.yml file.
```

---

## 💡 Quick Fixes

### **Add Field to Model**
```
Add [FIELD_NAME] to [MODEL_NAME]:

Type: [TYPE]
Nullable: [YES/NO]
Default: [VALUE]
Index: [YES/NO]

Provide:
1. Updated model
2. Alembic migration
3. Schema updates
4. Any necessary service changes
```

### **Add Endpoint**
```
Add [METHOD] /api/[path] endpoint:

Purpose: [DESCRIPTION]
Authentication: [REQUIRED/NOT REQUIRED]
Role: [USER/MODERATOR/ADMIN]
Request body: [SCHEMA]
Response: [SCHEMA]

Provide:
1. Router code
2. Schemas
3. Service method (if needed)
4. API documentation
```

### **Fix Validation**
```
Add validation to [SCHEMA]:

Fields to validate:
- [FIELD]: [RULES]
- [FIELD]: [RULES]

Provide updated Pydantic schema with validators.
```

---

## 🎓 Learning Prompts

### **Explain Code**
```
Explain this code in detail:

[PASTE CODE]

Please explain:
1. What it does
2. How it works
3. Why it's structured this way
4. Any design patterns used
5. Potential improvements
```

### **Compare Approaches**
```
Show me 3 different ways to implement [FEATURE]:

Requirements:
[LIST REQUIREMENTS]

For each approach provide:
1. Implementation code
2. Pros and cons
3. Performance considerations
4. Recommended use case
```

### **Best Practices**
```
What are the best practices for [TOPIC] in FastAPI?

Provide:
1. Recommended patterns
2. Code examples
3. Common pitfalls to avoid
4. Performance tips
5. Security considerations
```

---

## 📚 Template for Custom Prompts

```
Context:
[Describe your project and current state]

Goal:
[What you want to achieve]

Requirements:
1. [Requirement 1]
2. [Requirement 2]
3. [Requirement 3]

Constraints:
- [Constraint 1]
- [Constraint 2]

Current code (if applicable):
[PASTE CODE]

Please provide:
- [Expected output 1]
- [Expected output 2]
- [Expected output 3]
```

---

## 🎯 Tips for Effective Prompts

1. **Be specific** - Vague prompts = vague results
2. **Provide context** - Share relevant code and structure
3. **State requirements clearly** - List what you need
4. **Mention tech stack** - FastAPI, PostgreSQL, Redis, etc.
5. **Show existing patterns** - "Following the pattern in X..."
6. **Ask for explanations** - Learn, don't just copy-paste
7. **Iterate** - Refine based on initial response
8. **Test everything** - AI makes mistakes

---

*Use these prompts as starting points. Customize based on your specific needs and project state.*

*Last updated: January 2026*
