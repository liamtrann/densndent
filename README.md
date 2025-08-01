# Dens N Dent Healthcare - Full Stack Application

A full-stack healthcare application built with React (frontend) and Node.js (backend) with NetSuite integration.

## 🏗️ Architecture

- **Frontend**: React 19, Redux Toolkit, Tailwind CSS, Auth0
- **Backend**: Node.js, Express, NetSuite REST API
- **Database**: Compatible with PostgreSQL/MongoDB
- **Deployment**: Docker + Heroku

## 🚀 Quick Start

### Local Development

1. **Install dependencies**:
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend && npm install
   
   # Install frontend dependencies
   cd ../frontend && npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.template .env
   # Edit .env with your actual values
   ```

3. **Start development servers**:
   ```bash
   # From root directory - starts both frontend and backend
   npm run dev
   
   # Or start individually:
   npm run server  # Backend only
   npm run client  # Frontend only
   ```

### Docker Development

```bash
# Build and run with Docker
npm run docker:build
npm run docker:run

# Or use Docker Compose
docker-compose up --build
```

## 🌐 Deployment to Heroku

### Prerequisites

1. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Have a Heroku account

### Method 1: Using Deployment Script (Recommended)

**Windows (PowerShell):**
```powershell
.\deploy.ps1 your-app-name
```

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh your-app-name
```

### Method 2: Manual Deployment

1. **Login to Heroku**:
   ```bash
   heroku login
   heroku container:login
   ```

2. **Create and configure app**:
   ```bash
   heroku create your-app-name
   heroku stack:set container --app your-app-name
   ```

3. **Set environment variables**:
   ```bash
   heroku config:set NODE_ENV=production --app your-app-name
   heroku config:set AUTH0_DOMAIN=your_domain --app your-app-name
   heroku config:set AUTH0_CLIENT_ID=your_client_id --app your-app-name
   # Add other environment variables as needed
   ```

4. **Deploy**:
   ```bash
   heroku container:push web --app your-app-name
   heroku container:release web --app your-app-name
   ```

5. **Open your app**:
   ```bash
   heroku open --app your-app-name
   ```

## 📁 Project Structure

```
densndent/
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── api/           # API configurations
│   │   ├── redux/         # State management
│   │   └── config/        # App configuration
│   ├── public/
│   └── package.json
├── backend/               # Node.js server
│   ├── api/               # API routes
│   ├── suiteQL/           # NetSuite queries
│   ├── netsuiteRest/      # NetSuite REST API
│   ├── restapi/           # REST API endpoints
│   └── app.js             # Main server file
├── docker-compose.yml     # Docker Compose config
├── Dockerfile             # Production Docker image
├── heroku.yml             # Heroku container config
├── .env.template          # Environment variables template
└── package.json           # Root package.json
```

## 🔧 Environment Variables

Copy `.env.template` to `.env` and configure:

### Required Variables:
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 3001)
- `AUTH0_DOMAIN`: Your Auth0 domain
- `AUTH0_CLIENT_ID`: Your Auth0 client ID
- `AUTH0_CLIENT_SECRET`: Your Auth0 client secret

### Optional Variables:
- `DATABASE_URL`: Database connection string
- `NETSUITE_*`: NetSuite API credentials
- `STRIPE_SECRET_KEY`: Stripe payment processing
- `FRONTEND_URL`: Frontend URL for CORS (production)

## 📊 Monitoring & Debugging

### Heroku Commands:
```bash
# View logs
heroku logs --tail --app your-app-name

# Check app status
heroku ps --app your-app-name

# Access app shell
heroku run bash --app your-app-name

# View environment variables
heroku config --app your-app-name
```

### Health Check:
- Visit `https://your-app-name.herokuapp.com/health` to check server status

## 🛠️ Development Scripts

```bash
# Development
npm run dev          # Start both frontend and backend
npm run server       # Start backend only
npm run client       # Start frontend only

# Production
npm start            # Start production server
npm run build        # Build frontend for production

# Docker
npm run docker:build # Build Docker image
npm run docker:run   # Run Docker container

# Heroku
npm run heroku:build # Build and push to Heroku
npm run heroku:deploy # Release to Heroku
```

## 🔒 Security Notes

- Never commit `.env` files to git
- Use strong JWT secrets in production
- Configure CORS properly for your domain
- Keep all API keys secure in Heroku config vars

## 📞 Support

For deployment issues:
1. Check Heroku logs: `heroku logs --tail --app your-app-name`
2. Verify environment variables are set correctly
3. Ensure Docker builds successfully locally first

## 🚀 Next Steps

After successful deployment:
1. Set up custom domain (optional)
2. Configure SSL certificates
3. Set up monitoring and alerts
4. Configure CI/CD pipeline
5. Set up database backups
