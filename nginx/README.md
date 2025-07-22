# Nginx Setup Instructions for DensNDent

## Local Development Setup

### 1. Install Nginx

**Windows (using Chocolatey):**
```powershell
choco install nginx
```

**macOS (using Homebrew):**
```bash
brew install nginx
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install nginx
```

### 2. Copy Configuration Files

Copy the configuration files to your Nginx directory:

**Windows:**
- Copy `frontend.conf` to `C:\tools\nginx\conf\conf.d\`
- Copy `backend.conf` to `C:\tools\nginx\conf\conf.d\`
- Copy `nginx.conf` to `C:\tools\nginx\conf\`

**Linux/macOS:**
- Copy `frontend.conf` to `/etc/nginx/conf.d/`
- Copy `backend.conf` to `/etc/nginx/conf.d/`
- Copy `nginx.conf` to `/etc/nginx/`

### 3. Update Paths

Update the paths in the configuration files to match your setup:

**In frontend.conf:**
- Change `root /var/www/densndent/frontend/build;` to your React build path
- Example: `root C:\Users\Hong\Desktop\densndent\frontend\build;` (Windows)

**In backend.conf:**
- Verify the upstream server addresses match your Node.js app ports

### 4. Build React App

Build your React frontend for production:
```bash
cd frontend
npm run build
```

### 5. Start Services

**Start Backend:**
```bash
cd backend
npm install
npm start
```

**Start Nginx:**

*Windows:*
```powershell
cd C:\tools\nginx
nginx.exe
```

*Linux/macOS:*
```bash
sudo nginx
```

### 6. Test Setup

**Backend API:** http://localhost:8080/api/health
**Frontend:** http://localhost:80
**Kafka Health:** http://localhost:8080/kafka/health

## Production Deployment

### 1. SSL Certificates

Get SSL certificates from Let's Encrypt or your certificate provider:
```bash
# Using certbot for Let's Encrypt
sudo certbot --nginx -d densndent.com -d www.densndent.com -d api.densndent.com
```

### 2. Update Domain Names

Update `server_name` in the configuration files:
- `densndent.local` → `densndent.com`
- `api.densndent.local` → `api.densndent.com`

### 3. Docker Deployment

Use the provided Docker Compose file:
```bash
docker-compose -f nginx/docker-compose.nginx.yml up -d
```

### 4. Performance Tuning

**Increase worker processes:** Set to number of CPU cores
**Adjust worker_connections:** Based on your expected traffic
**Enable HTTP/2:** Add `http2` to listen directives

## Nginx Commands

**Test configuration:**
```bash
nginx -t
```

**Reload configuration:**
```bash
nginx -s reload
```

**Stop Nginx:**
```bash
nginx -s quit
```

**View logs:**
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## Troubleshooting

**Common Issues:**

1. **Permission denied:** Check file permissions and Nginx user
2. **Port conflicts:** Ensure ports 80, 443, 8080 are available
3. **Proxy errors:** Check if backend services are running
4. **SSL issues:** Verify certificate paths and permissions

**Log Locations:**
- Access logs: `/var/log/nginx/densndent_*_access.log`
- Error logs: `/var/log/nginx/densndent_*_error.log`

## Architecture Overview

```
Internet
    ↓
[Frontend Nginx :80/443]
    ├── Static files (React build)
    └── API proxy → [Backend Nginx :8080/8443]
                        └── Load balancer → [Node.js :3001]
                                              ├── Kafka Services
                                              ├── VersaPay API
                                              └── NetSuite API
```

This setup provides:
- ✅ Load balancing
- ✅ SSL termination
- ✅ Static file serving
- ✅ API rate limiting
- ✅ Security headers
- ✅ Gzip compression
- ✅ Caching
- ✅ Health checks
