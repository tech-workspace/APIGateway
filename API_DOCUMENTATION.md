# 🚀 API Gateway - Complete API Documentation

## 🚀 **Quick API Reference - All Available Endpoints**

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `GET` | `/` | ❌ No | Health check - API status verification |
| `POST` | `/v1/auth/signup` | ❌ No | Create new user account |
| `POST` | `/v1/auth/login` | ❌ No | Authenticate user & get JWT token |
| `GET` | `/v1/auth/profile` | ✅ Yes | Get current user's profile |
| `PUT` | `/v1/auth/profile` | ✅ Yes | Update current user's profile |
| `GET` | `/v1/auth/users` | ✅ Yes | Get paginated users list with search |
| `POST` | `/v1/questions` | ✅ Yes | Create new question |
| `GET` | `/v1/questions` | ✅ Yes | Get paginated questions with search & filters |
| `GET` | `/v1/questions/:id` | ✅ Yes | Get question by ID |
| `PUT` | `/v1/questions/:id` | ✅ Yes | Update question |
| `DELETE` | `/v1/questions/:id` | ✅ Yes | Delete question |
| `GET` | `/v1/questions/category/:category` | ✅ Yes | Get questions by category |
| `GET` | `/v1/questions/level/:level` | ✅ Yes | Get questions by level |
| `GET` | `/v1/questions/stats` | ✅ Yes | Get question statistics |
| `GET` | `/v1/questions/categories` | ✅ Yes | Get available categories |
| `GET` | `/v1/questions/levels` | ✅ Yes | Get available levels |
| `POST` | `/v1/categories` | ✅ Yes | Create new category |
| `GET` | `/v1/categories` | ✅ Yes | Get paginated categories with search & filters |
| `GET` | `/v1/categories/:id` | ✅ Yes | Get category by ID |
| `PUT` | `/v1/categories/:id` | ✅ Yes | Update category |
| `DELETE` | `/v1/categories/:id` | ✅ Yes | Delete category |
| `GET` | `/v1/categories/active` | ✅ Yes | Get active categories |
| `GET` | `/v1/categories/with-counts` | ✅ Yes | Get categories with question counts |
| `PATCH` | `/v1/categories/:id/toggle-status` | ✅ Yes | Toggle category active status |
| `PUT` | `/v1/categories/sort-order` | ✅ Yes | Update category sort order |

### **🔑 Authentication Details:**
- **Public Endpoints:** Health check, Signup, Login
- **Protected Endpoints:** Profile management, Users list
- **Auth Method:** JWT Bearer token in `Authorization` header
- **Token Format:** `Authorization: Bearer <your_jwt_token>`

### **📊 Response Format:**
- **Success:** `{"success": true, "message": "...", "data": {...}}`
- **Error:** `{"success": false, "message": "Error description"}`
- **Status Codes:** 200 (Success), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 500 (Server Error)

---

## 📋 Table of Contents
- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [API Endpoints](#api-endpoints)
  - [Health Check](#health-check)
  - [Authentication APIs](#authentication-apis)
  - [User Management APIs](#user-management-apis)

---

## 🌟 Overview
This API Gateway provides a comprehensive set of endpoints for user authentication, profile management, and user administration. Built with Node.js, Express, and MongoDB, it offers secure, scalable, and RESTful APIs.

**Version:** v1  
**Environment:** Production  
**Database:** MongoDB Atlas (Workspace Database)

---

## 🔗 Base URL
```
Local Development: http://localhost:3000
Production: [Your Railway Domain]
```

---

## 🔐 Authentication
The API uses **JWT (JSON Web Tokens)** for authentication. Protected endpoints require a valid token in the request header.

### Token Format
```
Authorization: Bearer <your_jwt_token>
```

### Getting a Token
1. Use the `/v1/auth/signup` endpoint to create an account
2. Use the `/v1/auth/login` endpoint to authenticate and receive a token
3. Include the token in subsequent requests to protected endpoints

---

## ❌ Error Handling
All API responses follow a consistent error format:

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (optional)"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## 🚦 Rate Limiting
- **Window:** 15 minutes
- **Max Requests:** 100 requests per window
- **Headers:** Rate limit information is included in response headers

---

## 📡 API Endpoints

---

### 🏥 Health Check

#### GET `/`
**Description:** Health check endpoint to verify API status

**Authentication:** Not required

**Request:**
```http
GET /
```

**Response:**
```json
{
  "success": true,
  "message": "API Gateway is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

---

### 🔐 Authentication APIs

#### POST `/v1/auth/signup`
**Description:** Create a new user account

**Authentication:** Not required

**Request Headers:**
```http
Content-Type: application/json
```

**Request Body:**
```json
{
  "fullName": "John Doe",
  "mobile": "1234567890",
  "password": "securePassword123"
}
```

**Field Validation:**
- `fullName`: Required, string, 2-50 characters
- `mobile`: Required, string, 10-15 characters, unique
- `password`: Required, string, minimum 8 characters

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "_id": "65c1234567890abcdef12345",
      "fullName": "John Doe",
      "mobile": "1234567890",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "error": "Mobile number already exists"
}
```

---

#### POST `/v1/auth/login`
**Description:** Authenticate user and receive access token

**Authentication:** Not required

**Request Headers:**
```http
Content-Type: application/json
```

**Request Body:**
```json
{
  "mobile": "1234567890",
  "password": "securePassword123"
}
```

**Field Validation:**
- `mobile`: Required, string
- `password`: Required, string

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "65c1234567890abcdef12345",
      "fullName": "John Doe",
      "mobile": "1234567890",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 👤 User Management APIs

#### GET `/v1/auth/profile`
**Description:** Get current user's profile information

**Authentication:** Required (JWT Token)

**Request Headers:**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request:**
```http
GET /v1/auth/profile
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "_id": "65c1234567890abcdef12345",
    "fullName": "John Doe",
    "mobile": "1234567890",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Access token is required"
}
```

---

#### PUT `/v1/auth/profile`
**Description:** Update current user's profile information

**Authentication:** Required (JWT Token)

**Request Headers:**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "fullName": "John Smith",
  "mobile": "0987654321"
}
```

**Field Validation:**
- `fullName`: Optional, string, 2-50 characters
- `mobile`: Optional, string, 10-15 characters, unique

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "65c1234567890abcdef12345",
    "fullName": "John Smith",
    "mobile": "0987654321",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Mobile number already exists"
}
```

---

#### GET `/v1/auth/users`
**Description:** Get paginated list of users with optional search

**Authentication:** Required (JWT Token)

**Request Headers:**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters:**
- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 10, max: 100
- `search` (optional): Search term for fullName or mobile

**Request Examples:**
```http
GET /v1/auth/users
GET /v1/auth/users?page=1&limit=20
GET /v1/auth/users?search=john
GET /v1/auth/users?page=2&limit=5&search=123
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "_id": "65c1234567890abcdef12345",
        "fullName": "John Doe",
        "mobile": "1234567890",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      },
      {
        "_id": "65c1234567890abcdef12346",
        "fullName": "Jane Smith",
        "mobile": "0987654321",
        "createdAt": "2024-01-15T11:00:00.000Z",
        "updatedAt": "2024-01-15T11:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalUsers": 50,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Access token is required"
}
```

---

## 🔧 Testing with Postman

### 1. **Setup Collection**
Create a new collection in Postman for your API Gateway

### 2. **Environment Variables**
Set up environment variables:
- `base_url`: `http://localhost:3000` (or your production URL)
- `auth_token`: Leave empty initially

### 3. **Testing Flow**

#### Step 1: Signup
```http
POST {{base_url}}/v1/auth/signup
Content-Type: application/json

{
  "fullName": "Test User",
  "mobile": "1234567890",
  "password": "testpass123"
}
```

#### Step 2: Login
```http
POST {{base_url}}/v1/auth/login
Content-Type: application/json

{
  "mobile": "1234567890",
  "password": "testpass123"
}
```

#### Step 3: Use Token
After login, copy the token from the response and set it in your environment variable `auth_token`

#### Step 4: Test Protected Endpoints
```http
GET {{base_url}}/v1/auth/profile
Authorization: Bearer {{auth_token}}
```

---

## 📝 Notes for API Consumers

### **Password Security**
- Passwords are automatically hashed using bcrypt
- Never store or log passwords in plain text
- Minimum password length: 8 characters

### **Token Management**
- JWT tokens have an expiration time
- Store tokens securely (localStorage, sessionStorage, or secure cookies)
- Include tokens in the `Authorization` header for all protected requests

### **Data Validation**
- All input data is validated using Joi schemas
- Mobile numbers must be unique across the system
- Full names are trimmed and validated for length

### **Pagination**
- Default page size is 10 items
- Maximum page size is 100 items
- Page numbers start from 1
- Search functionality works across fullName and mobile fields

### **Error Responses**
- Always check the `success` field in responses
- Handle different HTTP status codes appropriately
- Display user-friendly error messages from the `message` field

---

## 🚀 Deployment Information

### **Environment Variables Required**
```env
NODE_ENV=production
PORT=3000
WS_MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=*
LOG_LEVEL=info
```

### **Health Check**
The health check endpoint (`/`) should be used by load balancers and monitoring systems to verify API availability.

---

## 📞 Support

For technical support or questions about the API:
- Check the error messages in API responses
- Verify your authentication token is valid
- Ensure all required fields are provided in requests
- Check rate limiting headers for usage information

---

## 📚 Questions Management APIs

### 🆕 **POST** `/v1/questions`
**Description:** Create a new question

**Authentication:** Required (JWT Token)

**Request Headers:**
```http
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "What is the difference between let, const, and var in JavaScript?",
  "answer": "In JavaScript, let, const, and var are different ways to declare variables. var has function scope and can be redeclared and reassigned. let has block scope, can be reassigned but not redeclared. const has block scope and cannot be reassigned or redeclared after initialization.",
  "category": "JavaScript",
  "level": "Beginner"
}
```

**Field Validation:**
- `title`: Required, string, 1-500 characters
- `answer`: Required, string, 1-5000 characters
- `category`: Required, must be one of the predefined categories
- `level`: Required, string (any value, no restrictions)

**Available Categories:**
JavaScript, Python, Java, C++, C#, PHP, Ruby, Go, Rust, Swift, Kotlin, TypeScript, React, Vue, Angular, Node.js, Database, DevOps, System Design, Algorithms, Data Structures, Other

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Question created successfully",
  "data": {
    "_id": "65c1234567890abcdef12345",
    "title": "What is the difference between let, const, and var in JavaScript?",
    "answer": "In JavaScript, let, const, and var are different ways to declare variables...",
    "category": "JavaScript",
    "level": "Beginner",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 📖 **GET** `/v1/questions`
**Description:** Get paginated questions with search, filtering, and sorting

**Authentication:** Required (JWT Token)

**Request Headers:**
```http
Authorization: Bearer <your_jwt_token>
```

**Query Parameters:**
- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 10, max: 100
- `search` (optional): Search term for title, answer, or category
- `category` (optional): Filter by specific category
- `level` (optional): Filter by specific level
- `sortBy` (optional): Sort field (title, category, level, createdAt, updatedAt), default: createdAt
- `sortOrder` (optional): Sort order (asc, desc), default: desc

**Request Examples:**
```http
GET /v1/questions
GET /v1/questions?page=1&limit=20
GET /v1/questions?search=javascript
GET /v1/questions?category=JavaScript&level=Beginner
GET /v1/questions?sortBy=title&sortOrder=asc
GET /v1/questions?page=2&limit=5&search=react&category=React&level=Intermediate
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Questions retrieved successfully",
  "data": {
    "questions": [
      {
        "_id": "65c1234567890abcdef12345",
        "title": "What is the difference between let, const, and var in JavaScript?",
        "answer": "In JavaScript, let, const, and var are different ways to declare variables...",
        "category": "JavaScript",
        "level": "Beginner",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalQuestions": 50,
      "hasNextPage": true,
      "hasPrevPage": false,
      "limit": 10
    }
  }
}
```

---

### 🔍 **GET** `/v1/questions/:id`
**Description:** Get a specific question by ID

**Authentication:** Required (JWT Token)

**Request Headers:**
```http
Authorization: Bearer <your_jwt_token>
```

**Request:**
```http
GET /v1/questions/65c1234567890abcdef12345
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Question retrieved successfully",
  "data": {
    "_id": "65c1234567890abcdef12345",
    "title": "What is the difference between let, const, and var in JavaScript?",
    "answer": "In JavaScript, let, const, and var are different ways to declare variables...",
    "category": "JavaScript",
    "level": "Beginner",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "message": "Question not found"
}
```

---

### ✏️ **PUT** `/v1/questions/:id`
**Description:** Update an existing question

**Authentication:** Required (JWT Token)

**Request Headers:**
```http
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "title": "Updated question title",
  "answer": "Updated answer content",
  "category": "Python",
  "level": "Intermediate"
}
```

**Request:**
```http
PUT /v1/questions/65c1234567890abcdef12345
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Question updated successfully",
  "data": {
    "_id": "65c1234567890abcdef12345",
    "title": "Updated question title",
    "answer": "Updated answer content",
    "category": "Python",
    "level": "Intermediate",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

---

### 🗑️ **DELETE** `/v1/questions/:id`
**Description:** Delete a question

**Authentication:** Required (JWT Token)

**Request Headers:**
```http
Authorization: Bearer <your_jwt_token>
```

**Request:**
```http
DELETE /v1/questions/65c1234567890abcdef12345
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Question deleted successfully",
  "data": {
    "id": "65c1234567890abcdef12345"
  }
}
```

---

### 📂 **GET** `/v1/questions/category/:category`
**Description:** Get questions filtered by specific category

**Authentication:** Required (JWT Token)

**Request Headers:**
```http
Authorization: Bearer <your_jwt_token>
```

**Request:**
```http
GET /v1/questions/category/JavaScript?page=1&limit=10
```

**Response:** Same format as GET `/v1/questions` but filtered by category

---

### 📊 **GET** `/v1/questions/level/:level`
**Description:** Get questions filtered by specific level

**Authentication:** Required (JWT Token)

**Request Headers:**
```http
Authorization: Bearer <your_jwt_token>
```

**Request:**
```http
GET /v1/questions/level/Beginner?page=1&limit=10
```

**Response:** Same format as GET `/v1/questions` but filtered by level

---

### 📈 **GET** `/v1/questions/stats`
**Description:** Get question statistics and analytics

**Authentication:** Required (JWT Token)

**Request Headers:**
```http
Authorization: Bearer <your_jwt_token>
```

**Request:**
```http
GET /v1/questions/stats
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Question statistics retrieved successfully",
  "data": {
    "totalQuestions": 150,
    "categoryStats": [
      { "_id": "JavaScript", "count": 45 },
      { "_id": "Python", "count": 32 },
      { "_id": "React", "count": 28 }
    ],
    "levelStats": [
      { "_id": "Beginner", "count": 60 },
      { "_id": "Intermediate", "count": 55 },
      { "_id": "Advanced", "count": 25 },
      { "_id": "Expert", "count": 10 }
    ]
  }
}
```

---

### 🏷️ **GET** `/v1/questions/categories`
**Description:** Get list of all available categories

**Authentication:** Required (JWT Token)

**Request Headers:**
```http
Authorization: Bearer <your_jwt_token>
```

**Request:**
```http
GET /v1/questions/categories
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "React",
    "Vue",
    "Angular",
    "Database",
    "DevOps",
    "System Design"
  ]
}
```

---

### 📋 **GET** `/v1/questions/levels`
**Description:** Get list of all available difficulty levels

**Authentication:** Required (JWT Token)

**Request Headers:**
```http
Authorization: Bearer <your_jwt_token>
```

**Request:**
```http
GET /v1/questions/levels
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Levels retrieved successfully",
  "data": [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Expert"
  ]
}
```

---

## 🔧 **Testing Questions API with Postman**

### **Step 1: Get Authentication Token**
First, login to get your JWT token using the auth endpoints.

### **Step 2: Create a Question**
```http
POST {{base_url}}/v1/questions
Authorization: Bearer {{auth_token}}
Content-Type: application/json

{
  "title": "What is the difference between let, const, and var in JavaScript?",
  "answer": "In JavaScript, let, const, and var are different ways to declare variables. var has function scope and can be redeclared and reassigned. let has block scope, can be reassigned but not redeclared. const has block scope and cannot be reassigned or redeclared after initialization.",
  "category": "JavaScript",
  "level": "Beginner"
}
```

### **Step 3: Get All Questions**
```http
GET {{base_url}}/v1/questions?page=1&limit=10
Authorization: Bearer {{auth_token}}
```

### **Step 4: Search Questions**
```http
GET {{base_url}}/v1/questions?search=javascript&category=JavaScript&level=Beginner
Authorization: Bearer {{auth_token}}
```

### **Step 5: Update a Question**
```http
PUT {{base_url}}/v1/questions/{{question_id}}
Authorization: Bearer {{auth_token}}
Content-Type: application/json

{
  "level": "Intermediate"
}
```

---

## 🏷️ Categories Management APIs

### 🆕 **POST** `/v1/categories`
**Description:** Create a new category

**Authentication:** Required (JWT Token)

**Request Headers:**
```http
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Machine Learning",
  "description": "Questions related to machine learning and AI",
  "color": "#10B981",
  "icon": "🤖",
  "isActive": true,
  "sortOrder": 5
}
```

**Field Validation:**
- `name`: Required, string, max 30 characters, unique
- `description`: Optional, string, max 200 characters
- `color`: Optional, valid hex color code (e.g., #3B82F6)
- `icon`: Optional, string, max 10 characters
- `isActive`: Optional, boolean, default: true
- `sortOrder`: Optional, integer, min 0, default: 0

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "_id": "65c1234567890abcdef12345",
    "name": "Machine Learning",
    "description": "Questions related to machine learning and AI",
    "color": "#10B981",
    "icon": "🤖",
    "isActive": true,
    "sortOrder": 5,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 📖 **GET** `/v1/categories`
**Description:** Get paginated categories with search, filtering, and sorting

**Authentication:** Required (JWT Token)

**Request Headers:**
```http
Authorization: Bearer <your_jwt_token>
```

**Query Parameters:**
- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 10, max: 100
- `search` (optional): Search term for name or description
- `isActive` (optional): Filter by active status (true/false)
- `sortBy` (optional): Sort field (name, sortOrder, createdAt, updatedAt, questionCount), default: sortOrder
- `sortOrder` (optional): Sort order (asc, desc), default: asc

**Request Examples:**
```http
GET /v1/categories
GET /v1/categories?page=1&limit=20
GET /v1/categories?search=machine
GET /v1/categories?isActive=true&sortBy=name&sortOrder=asc
GET /v1/categories?page=2&limit=5&search=ai&isActive=true&sortBy=questionCount&sortOrder=desc
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": {
    "categories": [
      {
        "_id": "65c1234567890abcdef12345",
        "name": "Machine Learning",
        "description": "Questions related to machine learning and AI",
        "color": "#10B981",
        "icon": "🤖",
        "isActive": true,
        "sortOrder": 5,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalCategories": 25,
      "hasNextPage": true,
      "hasPrevPage": false,
      "limit": 10
    }
  }
}
```

---

### 🔍 **GET** `/v1/categories/:id`
**Description:** Get a specific category by ID

**Authentication:** Required (JWT Token)

**Request Headers:**
```http
Authorization: Bearer <your_jwt_token>
```

**Request:**
```http
GET /v1/categories/65c1234567890abcdef12345
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Category retrieved successfully",
  "data": {
    "_id": "65c1234567890abcdef12345",
    "name": "Machine Learning",
    "description": "Questions related to machine learning and AI",
    "color": "#10B981",
    "icon": "🤖",
    "isActive": true,
    "sortOrder": 5,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### ✏️ **PUT** `/v1/categories/:id`
**Description:** Update an existing category

**Authentication:** Required (JWT Token)

**Request Headers:**
```http
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "name": "Updated Category Name",
  "description": "Updated description",
  "color": "#EF4444",
  "icon": "🚀",
  "isActive": false,
  "sortOrder": 10
}
```

**Request:**
```http
PUT /v1/categories/65c1234567890abcdef12345
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "_id": "65c1234567890abcdef12345",
    "name": "Updated Category Name",
    "description": "Updated description",
    "color": "#EF4444",
    "icon": "🚀",
    "isActive": false,
    "sortOrder": 10,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

---

### 🗑️ **DELETE** `/v1/categories/:id`
**Description:** Delete a category (only if no questions are associated)

**Authentication:** Required (JWT Token)

**Request Headers:**
```http
Authorization: Bearer <your_jwt_token>
```

**Request:**
```http
DELETE /v1/categories/65c1234567890abcdef12345
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Category deleted successfully",
  "data": {
    "id": "65c1234567890abcdef12345"
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Cannot delete category. It has 15 question(s) associated with it."
}
```

---

### ✅ **GET** `/v1/categories/active`
**Description:** Get all active categories (for dropdowns, forms, etc.)

**Authentication:** Required (JWT Token)

**Request Headers:**
```http
Authorization: Bearer <your_jwt_token>
```

**Request:**
```http
GET /v1/categories/active
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Active categories retrieved successfully",
  "data": [
    {
      "name": "JavaScript",
      "description": "JavaScript programming questions",
      "color": "#F7DF1E",
      "icon": "⚡"
    },
    {
      "name": "Machine Learning",
      "description": "Questions related to machine learning and AI",
      "color": "#10B981",
      "icon": "🤖"
    }
  ]
}
```

---

### 📊 **GET** `/v1/categories/with-counts`
**Description:** Get categories with question counts for analytics

**Authentication:** Required (JWT Token)

**Request Headers:**
```http
Authorization: Bearer <your_jwt_token>
```

**Request:**
```http
GET /v1/categories/with-counts
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Categories with question counts retrieved successfully",
  "data": [
    {
      "_id": "65c1234567890abcdef12345",
      "name": "JavaScript",
      "description": "JavaScript programming questions",
      "color": "#F7DF1E",
      "icon": "⚡",
      "isActive": true,
      "sortOrder": 1,
      "questionCount": 45,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "65c1234567890abcdef12346",
      "name": "Machine Learning",
      "description": "Questions related to machine learning and AI",
      "color": "#10B981",
      "icon": "🤖",
      "isActive": true,
      "sortOrder": 5,
      "questionCount": 23,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### 🔄 **PATCH** `/v1/categories/:id/toggle-status`
**Description:** Toggle category active/inactive status

**Authentication:** Required (JWT Token)

**Request Headers:**
```http
Authorization: Bearer <your_jwt_token>
```

**Request:**
```http
PATCH /v1/categories/65c1234567890abcdef12345/toggle-status
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Category deactivated successfully",
  "data": {
    "_id": "65c1234567890abcdef12345",
    "name": "Machine Learning",
    "description": "Questions related to machine learning and AI",
    "color": "#10B981",
    "icon": "🤖",
    "isActive": false,
    "sortOrder": 5,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:40:00.000Z"
  }
}
```

---

### 📋 **PUT** `/v1/categories/sort-order`
**Description:** Bulk update category sort order

**Authentication:** Required (JWT Token)

**Request Headers:**
```http
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "categories": [
    { "id": "65c1234567890abcdef12345", "sortOrder": 1 },
    { "id": "65c1234567890abcdef12346", "sortOrder": 2 },
    { "id": "65c1234567890abcdef12347", "sortOrder": 3 }
  ]
}
```

**Request:**
```http
PUT /v1/categories/sort-order
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Category sort order updated successfully"
}
```

---

## 🔧 **Testing Categories API with Postman**

### **Step 1: Get Authentication Token**
First, login to get your JWT token using the auth endpoints.

### **Step 2: Create a Category**
```http
POST {{base_url}}/v1/categories
Authorization: Bearer {{auth_token}}
Content-Type: application/json

{
  "name": "Machine Learning",
  "description": "Questions related to machine learning and AI",
  "color": "#10B981",
  "icon": "🤖",
  "isActive": true,
  "sortOrder": 5
}
```

### **Step 3: Get All Categories**
```http
GET {{base_url}}/v1/categories?page=1&limit=10
Authorization: Bearer {{auth_token}}
```

### **Step 4: Get Active Categories**
```http
GET {{base_url}}/v1/categories/active
Authorization: Bearer {{auth_token}}
```

### **Step 5: Update a Category**
```http
PUT {{base_url}}/v1/categories/{{category_id}}
Authorization: Bearer {{auth_token}}
Content-Type: application/json

{
  "color": "#EF4444",
  "icon": "🚀"
}
```

### **Step 6: Toggle Category Status**
```http
PATCH {{base_url}}/v1/categories/{{category_id}}/toggle-status
Authorization: Bearer {{auth_token}}
```

---

## 🔄 **Updated Question Creation**

Now that categories are dynamic, when creating questions, you need to provide a valid category ID:

```http
POST {{base_url}}/v1/questions
Authorization: Bearer {{auth_token}}
Content-Type: application/json

{
  "title": "What is the difference between let, const, and var in JavaScript?",
  "answer": "In JavaScript, let, const, and var are different ways to declare variables...",
  "category": "JavaScript",
  "level": "Beginner"
}
```

**Note:** The `category` field now accepts any string value (e.g., "قران", "JavaScript", "Machine Learning").

---

*Last Updated: January 2024*  
*API Version: v1*
