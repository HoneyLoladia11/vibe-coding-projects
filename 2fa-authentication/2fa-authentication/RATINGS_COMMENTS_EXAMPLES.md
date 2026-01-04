# Ratings & Comments API Examples

Additional API examples for the new ratings and comments functionality.

## Base URL
```
http://localhost:8000
```

---

## 🌟 Ratings Endpoints

### Rate a Tool

**Create or update your rating for a tool (1-5 stars):**

```bash
curl -X POST "http://localhost:8000/api/tools/1/rate" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5
  }'
```

**Response:**
```json
{
  "id": 1,
  "tool_id": 1,
  "user_id": 1,
  "rating": 5,
  "created_at": "2026-01-04T10:30:00",
  "updated_at": "2026-01-04T10:30:00"
}
```

### Get Rating Statistics

**Get aggregated rating stats for a tool:**

```bash
curl -X GET "http://localhost:8000/api/tools/1/ratings/stats"
```

**Response:**
```json
{
  "average_rating": 4.5,
  "total_ratings": 10,
  "rating_distribution": {
    "1": 0,
    "2": 1,
    "3": 1,
    "4": 3,
    "5": 5
  }
}
```

### Get All Ratings

**Get list of all ratings for a tool:**

```bash
curl -X GET "http://localhost:8000/api/tools/1/ratings?skip=0&limit=50"
```

**Response:**
```json
[
  {
    "id": 1,
    "tool_id": 1,
    "user_id": 1,
    "rating": 5,
    "created_at": "2026-01-04T10:30:00",
    "updated_at": "2026-01-04T10:30:00"
  },
  ...
]
```

### Delete Your Rating

**Remove your rating from a tool:**

```bash
curl -X DELETE "http://localhost:8000/api/tools/1/rate" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:** `204 No Content`

---

## 💬 Comments Endpoints

### Create Comment

**Post a comment on a tool:**

```bash
curl -X POST "http://localhost:8000/api/tools/1/comments" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "This is an excellent tool! Highly recommend for React development."
  }'
```

**Response:**
```json
{
  "id": 1,
  "tool_id": 1,
  "user_id": 1,
  "comment": "This is an excellent tool! Highly recommend for React development.",
  "upvotes": 0,
  "downvotes": 0,
  "created_at": "2026-01-04T10:35:00",
  "updated_at": "2026-01-04T10:35:00",
  "username": null
}
```

### Get All Comments

**Get all comments for a tool:**

```bash
curl -X GET "http://localhost:8000/api/tools/1/comments?skip=0&limit=20"
```

**Response:**
```json
[
  {
    "id": 1,
    "tool_id": 1,
    "user_id": 1,
    "comment": "This is an excellent tool!",
    "upvotes": 5,
    "downvotes": 0,
    "created_at": "2026-01-04T10:35:00",
    "updated_at": "2026-01-04T10:35:00",
    "username": "john_doe"
  },
  ...
]
```

### Update Comment

**Edit your own comment:**

```bash
curl -X PUT "http://localhost:8000/api/tools/1/comments/1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "Updated: This tool is amazing for React and Vue projects!"
  }'
```

**Response:**
```json
{
  "id": 1,
  "tool_id": 1,
  "user_id": 1,
  "comment": "Updated: This tool is amazing for React and Vue projects!",
  "upvotes": 5,
  "downvotes": 0,
  "created_at": "2026-01-04T10:35:00",
  "updated_at": "2026-01-04T10:40:00",
  "username": null
}
```

### Delete Comment

**Delete your own comment (or any comment if moderator):**

```bash
curl -X DELETE "http://localhost:8000/api/tools/1/comments/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:** `204 No Content`

---

## 👍 Comment Voting Endpoints

### Vote on Comment

**Upvote a comment:**

```bash
curl -X POST "http://localhost:8000/api/tools/1/comments/1/vote" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "vote_type": "upvote"
  }'
```

**Downvote a comment:**

```bash
curl -X POST "http://localhost:8000/api/tools/1/comments/1/vote" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "vote_type": "downvote"
  }'
```

**Response:**
```json
{
  "message": "Comment upvoted successfully"
}
```

### Remove Your Vote

**Remove your vote from a comment:**

```bash
curl -X DELETE "http://localhost:8000/api/tools/1/comments/1/vote" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:** `204 No Content`

---

## 🔄 Complete Workflow Example

### Scenario: User interacts with a tool

```bash
# 1. Login
TOKEN=$(curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "john_doe", "password": "secure123"}' \
  | jq -r '.access_token')

# 2. View tool details
curl -X GET "http://localhost:8000/api/tools/1"

# 3. Rate the tool 5 stars
curl -X POST "http://localhost:8000/api/tools/1/rate" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"rating": 5}'

# 4. Add a comment
curl -X POST "http://localhost:8000/api/tools/1/comments" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"comment": "Great tool! Been using it for months."}'

# 5. Get rating stats
curl -X GET "http://localhost:8000/api/tools/1/ratings/stats"

# 6. Get all comments
curl -X GET "http://localhost:8000/api/tools/1/comments"

# 7. Upvote someone else's comment
curl -X POST "http://localhost:8000/api/tools/1/comments/2/vote" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"vote_type": "upvote"}'
```

---

## ⚠️ Error Responses

### Tool Not Found
```json
{
  "detail": "Tool not found"
}
```
**Status Code:** `404`

### Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```
**Status Code:** `401`

### Forbidden (trying to edit someone else's comment)
```json
{
  "detail": "Not authorized to edit this comment"
}
```
**Status Code:** `403`

### Invalid Rating
```json
{
  "detail": [
    {
      "loc": ["body", "rating"],
      "msg": "ensure this value is greater than or equal to 1",
      "type": "value_error.number.not_ge"
    }
  ]
}
```
**Status Code:** `422`

### Comment Too Short
```json
{
  "detail": [
    {
      "loc": ["body", "comment"],
      "msg": "ensure this value has at least 10 characters",
      "type": "value_error.any_str.min_length"
    }
  ]
}
```
**Status Code:** `422`

---

## 📊 Use Cases

### **Use Case 1: Community Feedback**
```
User discovers a tool → Rates it → Adds review comment → 
Other users read comments → Upvote helpful reviews
```

### **Use Case 2: Tool Quality Indicator**
```
Tool has 4.8 average rating → Appears higher in search → 
More users try it → More ratings → Better visibility
```

### **Use Case 3: Moderation**
```
User posts inappropriate comment → Other users report → 
Moderator reviews → Deletes comment → User gets warning
```

---

## 🎯 Business Rules

### **Ratings:**
- ✅ One rating per user per tool
- ✅ Rating must be 1-5 stars
- ✅ Users can update their rating
- ✅ Users can delete their rating
- ✅ Stats are cached for performance

### **Comments:**
- ✅ Multiple comments allowed per user per tool
- ✅ Minimum 10 characters
- ✅ Maximum 2000 characters
- ✅ Users can edit/delete own comments
- ✅ Moderators can delete any comment
- ✅ Comments show username

### **Voting:**
- ✅ One vote per user per comment
- ✅ Can change vote (upvote ↔ downvote)
- ✅ Can remove vote
- ✅ Vote counts update immediately
- ✅ Cannot vote on own comments (not enforced yet - could add)

---

## 📈 Performance Notes

### **Caching:**
- Rating stats cached for 5 minutes
- Comments cached per page
- Cache invalidated on create/update/delete

### **Optimization:**
- Comments include username (no extra query needed)
- Vote counts stored directly on comment (denormalized)
- Indexes on tool_id and user_id for fast lookups

---

*Add these endpoints to your API testing workflow!*
