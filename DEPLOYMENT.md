# 🚀 Railway Deployment Guide

This guide will walk you through deploying your API Gateway to Railway step by step.

## Prerequisites

- [Railway account](https://railway.app/)
- [MongoDB Atlas account](https://www.mongodb.com/atlas) (for production database)
- [GitHub account](https://github.com/) (optional, for automatic deployments)

## 🎯 Quick Deploy (Recommended)

### 1. Deploy via Railway Dashboard

1. **Visit Railway**: Go to [railway.app](https://railway.app/) and sign in
2. **Create New Project**: Click "New Project" → "Deploy from GitHub repo"
3. **Connect Repository**: Select your API Gateway repository
4. **Auto-Deploy**: Railway will automatically detect the Node.js project and deploy it

### 2. Set Environment Variables

In your Railway project dashboard, go to **Variables** tab and add:

```env
NODE_ENV=production
PORT=3000
MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/api_gateway
JWT_SECRET=your-super-secure-production-jwt-secret
JWT_EXPIRES_IN=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=*
```

### 3. Get Your Domain

Railway will provide you with a domain like: `https://your-project-name.railway.app`

## 🔧 Manual Deployment

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
# Set production environment
railway variables set NODE_ENV=production

# Set MongoDB connection (replace with your MongoDB Atlas URI)
railway variables set MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/api_gateway

# Set JWT secret (generate a strong one!)
railway variables set JWT_SECRET=your-super-secure-production-jwt-secret

# Set other variables
railway variables set JWT_EXPIRES_IN=7d
railway variables set RATE_LIMIT_WINDOW_MS=900000
railway variables set RATE_LIMIT_MAX_REQUESTS=100
railway variables set CORS_ORIGIN=*
```

### 5. Deploy

```bash
railway up
```

## 🗄️ MongoDB Atlas Setup

### 1. Create Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (free tier available)
3. Choose your preferred cloud provider and region

### 2. Create Database User

1. Go to **Database Access** → **Add New Database User**
2. Create a user with **Read and write to any database** permissions
3. Save the username and password

### 3. Get Connection String

1. Go to **Clusters** → **Connect**
2. Choose **Connect your application**
3. Copy the connection string
4. Replace `<username>`, `<password>`, and `<dbname>` with your values

Example:
```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/api_gateway
```

## 🔍 Verify Deployment

### 1. Check Health Endpoint

Visit: `https://your-domain.railway.app/health`

Expected response:
```json
{
  "success": true,
  "message": "API Gateway is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

### 2. Test Authentication Endpoints

#### Signup Test
```bash
curl -X POST https://your-domain.railway.app/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "mobile": "1234567890",
    "password": "password123"
  }'
```

#### Login Test
```bash
curl -X POST https://your-domain.railway.app/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "1234567890",
    "password": "password123"
  }'
```

## 📊 Monitoring & Logs

### View Logs

```bash
railway logs
```

### View Metrics

1. Go to your Railway project dashboard
2. Check the **Metrics** tab for:
   - CPU usage
   - Memory usage
   - Network I/O
   - Response times

## 🔄 Continuous Deployment

### GitHub Integration

1. Connect your GitHub repository to Railway
2. Enable automatic deployments on push to main branch
3. Railway will automatically redeploy on every push

### Manual Redeploy

```bash
railway up
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Failures
- Check if all dependencies are in `package.json`
- Verify Node.js version compatibility
- Check build logs in Railway dashboard

#### 2. Database Connection Issues
- Verify MongoDB Atlas connection string
- Check if IP whitelist includes Railway's IPs
- Ensure database user has correct permissions

#### 3. Environment Variables
- Verify all required variables are set
- Check variable names match exactly
- Restart deployment after changing variables

#### 4. Port Issues
- Railway automatically sets `PORT` environment variable
- Don't hardcode port numbers in your code

### Debug Commands

```bash
# Check project status
railway status

# View environment variables
railway variables

# Connect to project shell
railway shell

# View recent deployments
railway deployments
```

## 🔒 Security Best Practices

### 1. Environment Variables
- Never commit `.env` files to version control
- Use strong, unique JWT secrets
- Rotate secrets regularly

### 2. Database Security
- Use MongoDB Atlas with network access restrictions
- Enable MongoDB Atlas authentication
- Use strong database passwords

### 3. API Security
- Rate limiting is enabled by default
- CORS is configured for production
- Helmet security headers are active

## 📈 Scaling

### Automatic Scaling
Railway automatically scales your application based on traffic.

### Manual Scaling
1. Go to your project dashboard
2. Adjust resources in the **Settings** tab
3. Choose appropriate instance size

## 💰 Cost Optimization

### Free Tier
- 500 hours/month
- 1GB RAM
- Shared CPU

### Paid Plans
- Pay-per-use pricing
- Automatic scaling
- Custom domains
- SSL certificates included

## 🎉 Success!

Your API Gateway is now deployed and accessible to external applications! 

### Next Steps:
1. Update your client applications with the new API endpoint
2. Set up monitoring and alerting
3. Configure custom domain (optional)
4. Set up CI/CD pipeline
5. Monitor usage and costs

### Support
- [Railway Documentation](https://docs.railway.app/)
- [Railway Discord](https://discord.gg/railway)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
