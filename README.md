# API Gateway

A professional and scalable API Gateway built with Node.js, Express, and MongoDB. This project provides a robust foundation for building microservices and managing external application integrations.

## 🚀 Features

- **User Authentication**: Secure signup and login with JWT tokens
- **MongoDB Integration**: Robust database connection with Mongoose ODM
- **Input Validation**: Comprehensive request validation using Joi
- **Security**: Helmet, CORS, rate limiting, and other security measures
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Logging**: Request logging and performance monitoring
- **Production Ready**: Optimized for Railway deployment
- **Scalable Architecture**: Modular structure for easy expansion

## 🏗️ Project Structure

```
APIGateway/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection configuration
│   ├── controllers/
│   │   └── authController.js    # Authentication logic
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication
│   │   ├── security.js         # Security middleware
│   │   └── validation.js       # Request validation
│   ├── models/
│   │   └── User.js             # User data model
│   ├── routes/
│   │   ├── auth.js             # Authentication routes
│   │   └── index.js            # Main route aggregator
│   └── server.js               # Main application entry point
├── .env.example                 # Environment variables template
├── package.json                 # Dependencies and scripts
├── railway.json                 # Railway deployment configuration
└── README.md                    # Project documentation
```

## 🛠️ Tech Stack

- **Runtime**: Node.js (>=18.0.0)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcryptjs
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting
- **Deployment**: Railway

## 📋 Prerequisites

- Node.js (>=18.0.0)
- MongoDB instance (local or cloud)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd APIGateway
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

Required environment variables:
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/api_gateway
JWT_SECRET=your-super-secret-jwt-key
```

### 3. Start Development Server

```bash
npm run dev
```

The server will start at `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication Endpoints

#### Signup
```http
POST /v1/auth/signup
Content-Type: application/json

{
  "fullName": "John Doe",
  "mobile": "1234567890",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "fullName": "John Doe",
      "mobile": "1234567890",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### Login
```http
POST /v1/auth/login
Content-Type: application/json

{
  "mobile": "1234567890",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "fullName": "John Doe",
      "mobile": "1234567890",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### Get Profile (Protected)
```http
GET /v1/auth/profile
Authorization: Bearer <jwt_token>
```

#### Update Profile (Protected)
```http
PUT /v1/auth/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "fullName": "John Smith"
}
```

### Utility Endpoints

#### Health Check
```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "message": "API Gateway is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 🚀 Deployment to Railway

### 1. Install Railway CLI
```bash
npm install -g @railway/cli
```

### 2. Login to Railway
```bash
railway login
```

### 3. Initialize Project
```bash
railway init
```

### 4. Set Environment Variables
```bash
railway variables set NODE_ENV=production
railway variables set MONGODB_URI_PROD=your_mongodb_atlas_uri
railway variables set JWT_SECRET=your_production_jwt_secret
```

### 5. Deploy
```bash
railway up
```

## 🔧 Development

### Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
```

### Code Quality

- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **Joi**: Request validation
- **Error Handling**: Centralized error management

## 🛡️ Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing configuration
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Request sanitization and validation
- **Password Hashing**: bcrypt with salt rounds
- **JWT**: Secure token-based authentication

## 📊 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  fullName: String (2-100 chars, required),
  mobile: String (10-15 digits, unique, required),
  password: String (6+ chars, required, hashed),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-updated)
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

## 🔮 Roadmap

- [ ] Role-based access control
- [ ] API documentation with Swagger
- [ ] Webhook support
- [ ] Analytics and monitoring
- [ ] Multi-tenant support
- [ ] GraphQL endpoint
- [ ] Caching layer (Redis)
- [ ] Message queue integration
