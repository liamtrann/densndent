# Heroku Docker Deployment Script for Windows PowerShell
# Run this script to deploy your app to Heroku using Docker

param(
    [Parameter(Mandatory=$true)]
    [string]$AppName
)

Write-Host "🚀 Starting Heroku Docker deployment..." -ForegroundColor Green

# Check if Heroku CLI is installed
try {
    heroku --version | Out-Null
} catch {
    Write-Host "❌ Heroku CLI is not installed. Please install it first." -ForegroundColor Red
    Write-Host "Download from: https://devcenter.heroku.com/articles/heroku-cli" -ForegroundColor Yellow
    exit 1
}

# Check if logged in to Heroku
try {
    heroku auth:whoami | Out-Null
} catch {
    Write-Host "📝 Please login to Heroku first:" -ForegroundColor Yellow
    heroku login
}

Write-Host "📦 App name: $AppName" -ForegroundColor Cyan

# Login to Heroku Container Registry
Write-Host "🔐 Logging in to Heroku Container Registry..." -ForegroundColor Blue
heroku container:login

# Check if app exists, if not create it
try {
    heroku apps:info $AppName | Out-Null
    Write-Host "✅ App $AppName already exists" -ForegroundColor Green
} catch {
    Write-Host "🆕 Creating new Heroku app: $AppName" -ForegroundColor Yellow
    heroku create $AppName
}

# Set stack to container
Write-Host "🐳 Setting stack to container..." -ForegroundColor Blue
heroku stack:set container --app $AppName

# Set environment variables
Write-Host "⚙️ Setting environment variables..." -ForegroundColor Blue
heroku config:set NODE_ENV=production --app $AppName

# You can add more environment variables here:
# heroku config:set AUTH0_DOMAIN=your_domain --app $AppName
# heroku config:set AUTH0_CLIENT_ID=your_client_id --app $AppName

# Build and push Docker image
Write-Host "🔨 Building and pushing Docker image..." -ForegroundColor Blue
heroku container:push web --app $AppName

# Release the image
Write-Host "🚀 Releasing the image..." -ForegroundColor Blue
heroku container:release web --app $AppName

# Open the app
Write-Host "🎉 Deployment complete! Opening app..." -ForegroundColor Green
heroku open --app $AppName

Write-Host "✅ Deployment finished successfully!" -ForegroundColor Green
Write-Host "📊 You can check logs with: heroku logs --tail --app $AppName" -ForegroundColor Cyan
Write-Host "🔧 You can check app status with: heroku ps --app $AppName" -ForegroundColor Cyan
