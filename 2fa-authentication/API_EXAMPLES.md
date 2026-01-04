# API Examples

Колекция от примерни API заявки за тестване на системата.

## Базов URL
```
http://localhost:8000
```

## 1. Authentication Endpoints

### Register New User
```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "secure123"
  }'
```

### Login
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "secure123"
  }'
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "requires_2fa": false
}
```

### Get Current User Info
```bash
curl -X GET "http://localhost:8000/api/auth/me" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Setup Telegram 2FA
```bash
curl -X POST "http://localhost:8000/api/auth/setup-telegram" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "telegram_chat_id": "123456789"
  }'
```

### Verify 2FA Code
```bash
curl -X POST "http://localhost:8000/api/auth/verify-2fa" \
  -H "Authorization: Bearer TEMP_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "123456"
  }'
```

### Disable 2FA
```bash
curl -X POST "http://localhost:8000/api/auth/disable-2fa" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 2. Tools Endpoints

### Create Tool
```bash
curl -X POST "http://localhost:8000/api/tools" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "VS Code",
    "description": "Powerful code editor from Microsoft with great extensions",
    "category": "development",
    "url": "https://code.visualstudio.com"
  }'
```

### Get All Tools
```bash
# Get all tools
curl -X GET "http://localhost:8000/api/tools"

# With filters
curl -X GET "http://localhost:8000/api/tools?category=development&status=approved"

# With pagination
curl -X GET "http://localhost:8000/api/tools?skip=0&limit=10"
```

### Get Tool by ID
```bash
curl -X GET "http://localhost:8000/api/tools/1"
```

### Update Tool
```bash
curl -X PUT "http://localhost:8000/api/tools/1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Visual Studio Code",
    "description": "Updated description"
  }'
```

### Delete Tool
```bash
curl -X DELETE "http://localhost:8000/api/tools/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get My Tools
```bash
curl -X GET "http://localhost:8000/api/tools/my/tools" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Tools Statistics
```bash
curl -X GET "http://localhost:8000/api/tools/stats"
```

Response:
```json
{
  "total": 15,
  "by_status": {
    "pending": 3,
    "approved": 10,
    "rejected": 2
  },
  "by_category": {
    "development": 8,
    "design": 4,
    "productivity": 3
  }
}
```

## 3. Admin Endpoints

### Get All Tools (Admin)
```bash
# All tools
curl -X GET "http://localhost:8000/api/admin/tools" \
  -H "Authorization: Bearer MODERATOR_TOKEN"

# With filters
curl -X GET "http://localhost:8000/api/admin/tools?status=pending&category=development" \
  -H "Authorization: Bearer MODERATOR_TOKEN"
```

### Get Pending Tools
```bash
curl -X GET "http://localhost:8000/api/admin/tools/pending" \
  -H "Authorization: Bearer MODERATOR_TOKEN"
```

### Approve Tool
```bash
curl -X POST "http://localhost:8000/api/admin/tools/1/approve" \
  -H "Authorization: Bearer MODERATOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "approved": true,
    "reason": "Great tool, well documented"
  }'
```

### Reject Tool
```bash
curl -X POST "http://localhost:8000/api/admin/tools/1/approve" \
  -H "Authorization: Bearer MODERATOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "approved": false,
    "reason": "Does not meet quality standards"
  }'
```

### Get All Users (Admin Only)
```bash
curl -X GET "http://localhost:8000/api/admin/users" \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Filter by role
curl -X GET "http://localhost:8000/api/admin/users?role=moderator" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Update User Role (Admin Only)
```bash
curl -X PUT "http://localhost:8000/api/admin/users/2/role?new_role=moderator" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Get Audit Logs (Admin Only)
```bash
# All logs
curl -X GET "http://localhost:8000/api/admin/audit-logs" \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Filter by user
curl -X GET "http://localhost:8000/api/admin/audit-logs?user_id=1" \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Filter by action
curl -X GET "http://localhost:8000/api/admin/audit-logs?action=approve" \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Filter by entity type
curl -X GET "http://localhost:8000/api/admin/audit-logs?entity_type=tool" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Get Admin Statistics
```bash
curl -X GET "http://localhost:8000/api/admin/stats/overview" \
  -H "Authorization: Bearer MODERATOR_TOKEN"
```

Response:
```json
{
  "users": {
    "total": 25,
    "by_role": {
      "user": 20,
      "moderator": 3,
      "admin": 2
    },
    "with_2fa": 15
  },
  "tools": {
    "total": 50,
    "by_status": {
      "pending": 10,
      "approved": 35,
      "rejected": 5
    },
    "by_category": {
      "development": 20,
      "design": 15,
      "productivity": 10,
      "communication": 3,
      "analytics": 2
    }
  },
  "activity": {
    "total_actions": 150,
    "recent_actions": 10
  }
}
```

## Categories
Available categories:
- `development`
- `design`
- `productivity`
- `communication`
- `analytics`
- `other`

## Statuses
Available statuses:
- `pending` - Awaiting approval
- `approved` - Approved by moderator/admin
- `rejected` - Rejected by moderator/admin

## Roles
Available roles:
- `user` - Regular user (can create tools)
- `moderator` - Can approve/reject tools
- `admin` - Full access (can manage users and roles)

## Error Responses

### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```

### 403 Forbidden
```json
{
  "detail": "Access denied. Required role: admin, moderator"
}
```

### 404 Not Found
```json
{
  "detail": "Tool not found"
}
```

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```

## Testing Flow

### 1. Create Users
```bash
# Create regular user
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username": "user1", "email": "user1@test.com", "password": "pass123"}'

# Login and get token
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "user1", "password": "pass123"}'
```

### 2. Create Tools
```bash
# User creates a tool
curl -X POST "http://localhost:8000/api/tools" \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "GitHub",
    "description": "Version control platform",
    "category": "development",
    "url": "https://github.com"
  }'
```

### 3. Moderator Approval
```bash
# Get pending tools
curl -X GET "http://localhost:8000/api/admin/tools/pending" \
  -H "Authorization: Bearer MODERATOR_TOKEN"

# Approve tool
curl -X POST "http://localhost:8000/api/admin/tools/1/approve" \
  -H "Authorization: Bearer MODERATOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"approved": true, "reason": "Looks good!"}'
```

### 4. Check Results
```bash
# View approved tools
curl -X GET "http://localhost:8000/api/tools?status=approved"

# Check statistics
curl -X GET "http://localhost:8000/api/tools/stats"
```
