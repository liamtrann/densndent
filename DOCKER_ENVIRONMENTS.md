# Docker Environment Usage Guide

## 🚀 **Development Environment**

### Start Development Services
```bash
# Start all development services (with hot reload)
docker compose --profile dev up -d

# Start specific services
docker compose --profile dev up -d database redis kafka

# View logs
docker compose --profile dev logs -f backend-app-1
```

### Development Features:
- ✅ **Hot reload** - Code changes reflected immediately
- ✅ **Kafka UI** - Available at http://localhost:8090
- ✅ **Volume mounting** - Live code updates
- ✅ **Debug ports** - Easy debugging setup

### Access Development:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080
- **Kafka UI**: http://localhost:8090
- **Database**: localhost:5432

---

## 🏭 **Production Environment**

### Start Production Services
```bash
# Start all production services
docker compose --profile prod up -d

# Start with custom environment file
docker compose --profile prod --env-file .env.production up -d

# Scale backend instances
docker compose --profile prod up -d --scale backend-prod-1=3
```

### Production Features:
- ✅ **No volume mounting** - Faster & secure
- ✅ **Resource limits** - CPU/Memory constraints
- ✅ **Optimized images** - Smaller, production-ready
- ✅ **Security hardened** - Non-root users, secrets
- ✅ **Health checks** - Proper monitoring
- ❌ **No Kafka UI** - Security (use external monitoring)

### Production Access:
- **Frontend**: https://your-domain.com
- **Backend API**: https://api.your-domain.com
- **Database**: Internal network only

---

## 📊 **Service Comparison**

| Feature | Development | Production |
|---------|-------------|------------|
| **Hot Reload** | ✅ Yes | ❌ No |
| **Volume Mount** | ✅ Yes | ❌ No |
| **Kafka UI** | ✅ Yes | ❌ No |
| **Resource Limits** | ❌ No | ✅ Yes |
| **Multi-stage Build** | ✅ Dev Stage | ✅ Prod Stage |
| **Security** | 🔶 Basic | ✅ Hardened |

---

## 🛠️ **Common Commands**

### Environment Management
```bash
# Switch to development
docker compose --profile dev up -d

# Switch to production
docker compose --profile prod up -d

# Stop all services
docker compose down

# Clean rebuild
docker compose down --volumes --rmi all
docker compose --profile dev up --build -d
```

### Monitoring & Debugging
```bash
# Check service health
docker compose ps

# View specific logs
docker compose logs backend-app-1
docker compose logs backend-prod-1

# Execute commands in containers
docker compose exec backend-app-1 /bin/sh
docker compose exec database psql -U densndent_user -d densndent
```

### Scaling (Production)
```bash
# Scale backend instances
docker compose --profile prod up -d --scale backend-prod-1=3 --scale backend-prod-2=2

# Check scaling
docker compose ps | grep backend-prod
```

---

## 🔧 **Configuration**

### Environment Files:
- `.env` - Development configuration
- `.env.production` - Production configuration

### Key Differences:
```bash
# Development
NODE_ENV=development
VERSAPAY_BASE_URL=https://api-sandbox.versapay.com

# Production  
NODE_ENV=production
VERSAPAY_BASE_URL=https://api.versapay.com
```

---

## 🚨 **Production Deployment Checklist**

- [ ] Update `.env.production` with real credentials
- [ ] Obtain SSL certificates
- [ ] Configure domain names in nginx configs
- [ ] Set up external monitoring (replace Kafka UI)
- [ ] Configure log rotation
- [ ] Set up database backups
- [ ] Configure firewall rules
- [ ] Test with load testing tools

---

**Your Docker setup is now optimized for both development and production! 🎯**
