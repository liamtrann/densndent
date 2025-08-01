# Simple Deploy Script
param([string]$AppName)

if (!$AppName) {
    Write-Host "Usage: .\deploy.ps1 your-app-name" -ForegroundColor Red
    exit
}

Write-Host "🚀 Deploying $AppName..." -ForegroundColor Green

# Login and setup
heroku login
heroku container:login
heroku create $AppName -ErrorAction SilentlyContinue
heroku stack:set container --app $AppName

# Set basic config
heroku config:set NODE_ENV=production --app $AppName

# Deploy
heroku container:push web --app $AppName
heroku container:release web --app $AppName

Write-Host "✅ Done! Opening app..." -ForegroundColor Green
heroku open --app $AppName
