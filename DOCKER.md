# Docker Setup for DensNDent Ecommerce Platform

## 🚀 Quick Start

### 1. Build and Start All Services
```bash
docker-compose up -d
```

### 2. Build and Start for Development
```bash
# Start with frontend development server
docker-compose --profile dev up -d
```

### 3. Start Specific Services
```bash
# Start only backend services
docker-compose up -d database redis kafka backend-app-1

# Start only Nginx and apps
docker-compose up -d nginx-frontend nginx-backend backend-app-1 backend-app-2
```

## 📋 Services Overview

| Service | Port | Description |
|---------|------|-------------|
| **nginx-frontend** | 80, 443 | Frontend web server |
| **nginx-backend** | 8080, 8443 | Backend API gateway |
| **backend-app-1** | 3001 | Main backend application |
| **backend-app-2** | 3002 | Load balanced backend |
| **database** | 5432 | PostgreSQL database |
| **redis** | 6379 | Cache and session store |
| **kafka** | 9092 | Message broker |
| **zookeeper** | 2181 | Kafka coordination |
| **kafka-ui** | 8090 | Kafka management UI |
| **frontend-dev** | 3000 | Development frontend |

## 🔧 Configuration

### Environment Variables
Create/update these files before running:

**Backend (.env):**
```env
# Database
DATABASE_URL=postgresql://densndent_user:your_secure_password@database:5432/densndent

# Redis
REDIS_URL=redis://redis:6379

# Kafka
KAFKA_BROKER=kafka:9092

# VersaPay
VERSAPAY_API_TOKEN=your_api_token
VERSAPAY_BASE_URL=https://api-sandbox.versapay.com

# NetSuite
NETSUITE_BASE_URL=https://your-account.suitetalk.api.netsuite.com
```

**Frontend (.env):**
```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_VERSAPAY_PUBLISHABLE_KEY=pk_test_your_key
```

### SSL Certificates
For HTTPS, place your certificates in the `./ssl/` directory:
```
ssl/
  ├── densndent.crt
  └── densndent.key
```

## 🏗️ Build Process

### Backend Application
```bash
# Build backend image
docker-compose build backend-app-1

# View logs
docker-compose logs -f backend-app-1
```

### Frontend Application
```bash
# Build frontend for production
cd frontend
npm run build

# Or build Docker image for development
docker-compose build frontend-dev
```

## 🔍 Monitoring & Debugging

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend-app-1

# Last 100 lines
docker-compose logs --tail=100 kafka
```

### Service Health
```bash
# Check all container status
docker-compose ps

# Check specific service health
docker-compose exec backend-app-1 curl http://localhost:3001/health

# Check Kafka topics
docker-compose exec kafka kafka-topics --bootstrap-server localhost:9092 --list
```

### Access Services
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080
- **Kafka UI**: http://localhost:8090
- **Database**: `psql -h localhost -p 5432 -U densndent_user -d densndent`

## 🛠️ Development Commands

### Database Operations
```bash
# Access database
docker-compose exec database psql -U densndent_user -d densndent

# Backup database
docker-compose exec database pg_dump -U densndent_user densndent > backup.sql

# Restore database
docker-compose exec -T database psql -U densndent_user -d densndent < backup.sql
```

### Kafka Operations
```bash
# Create topic
docker-compose exec kafka kafka-topics --bootstrap-server localhost:9092 --create --topic test-topic --partitions 3

# List topics
docker-compose exec kafka kafka-topics --bootstrap-server localhost:9092 --list

# Send test message
docker-compose exec kafka kafka-console-producer --bootstrap-server localhost:9092 --topic order.created

# Read messages
docker-compose exec kafka kafka-console-consumer --bootstrap-server localhost:9092 --topic order.created --from-beginning
```

### Scaling Services
```bash
# Scale backend to 3 instances
docker-compose up -d --scale backend-app-1=3

# Update Nginx upstream to include new instances
# Edit nginx/backend.conf and reload
docker-compose exec nginx-backend nginx -s reload
```

## 🔒 Production Deployment

### 1. Update Environment
```bash
# Set production environment
export NODE_ENV=production

# Use production Docker Compose override
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 2. SSL Configuration
- Obtain SSL certificates from Let's Encrypt or certificate provider
- Update `nginx/ssl.conf` with your domain names
- Mount certificates in docker-compose.yml

### 3. Security Hardening
- Change default database passwords
- Use Docker secrets for sensitive data
- Enable firewall rules
- Set up log monitoring

## 🚨 Troubleshooting

### Common Issues

**Port conflicts:**
```bash
# Check what's using ports
netstat -tulpn | grep :80
netstat -tulpn | grep :3001

# Stop conflicting services
sudo systemctl stop apache2
sudo systemctl stop nginx
```

**Permission issues:**
```bash
# Fix volume permissions
sudo chown -R 1001:1001 ./backend
sudo chown -R 999:999 ./postgres-data
```

**Memory issues:**
```bash
# Increase Docker memory limit
# Docker Desktop -> Settings -> Resources -> Memory -> 8GB

# Check container memory usage
docker stats
```

**Network issues:**
```bash
# Recreate network
docker-compose down
docker network prune
docker-compose up -d
```

### Clean Restart
```bash
# Stop all services
docker-compose down

# Remove volumes (careful: deletes data!)
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Full cleanup and restart
docker system prune -f
docker-compose up -d --build
```

## 📊 Performance Optimization

### Production Settings
- Set appropriate memory limits
- Use multi-stage builds
- Enable Nginx caching
- Configure log rotation
- Set up monitoring with Prometheus/Grafana

### Resource Limits
Add to docker-compose.yml:
```yaml
services:
  backend-app-1:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

This Docker setup provides a complete, production-ready environment for your DensNDent ecommerce platform with Kafka-based payment processing! 🎯
