# Fix Package Lock Script for Windows PowerShell
# This script fixes package-lock.json sync issues and deploys to Heroku

param(
    [Parameter(Mandatory=$true)]
    [string]$AppName
)

Write-Host "🔧 Fixing package-lock.json sync issues..." -ForegroundColor Yellow

# Function to safely remove files/folders
function Remove-ItemSafely {
    param([string]$Path)
    if (Test-Path $Path) {
        Remove-Item -Path $Path -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "✅ Removed $Path" -ForegroundColor Green
    }
}

# Step 1: Clean all lock files and node_modules
Write-Host "🧹 Cleaning lock files and node_modules..." -ForegroundColor Cyan

Remove-ItemSafely "package-lock.json"
Remove-ItemSafely "node_modules"
Remove-ItemSafely "frontend/package-lock.json"
Remove-ItemSafely "frontend/node_modules"
Remove-ItemSafely "backend/package-lock.json"
Remove-ItemSafely "backend/node_modules"

# Step 2: Reinstall dependencies in correct order
Write-Host "📦 Reinstalling dependencies..." -ForegroundColor Cyan

# Install root dependencies
Write-Host "Installing root dependencies..." -ForegroundColor White
npm install

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor White
Set-Location frontend
npm install
Set-Location ..

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor White
Set-Location backend
npm install
Set-Location ..

# Step 3: Test local build
Write-Host "🔨 Testing local build..." -ForegroundColor Cyan
Set-Location frontend
try {
    npm run build
    Write-Host "✅ Frontend build successful!" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend build failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
Set-Location ..

# Step 4: Commit changes
Write-Host "📝 Committing dependency fixes..." -ForegroundColor Cyan
git add .
git status
$commitMessage = "Fix package-lock.json sync issues and update dependencies"
git commit -m $commitMessage

# Step 5: Deploy to Heroku using container
Write-Host "🚀 Deploying to Heroku..." -ForegroundColor Green

# Login to Heroku (if not already logged in)
try {
    heroku auth:whoami | Out-Null
    Write-Host "✅ Already logged in to Heroku" -ForegroundColor Green
} catch {
    Write-Host "🔑 Please login to Heroku..." -ForegroundColor Yellow
    heroku login
}

# Login to container registry
heroku container:login

# Check if app exists, create if not
try {
    heroku apps:info $AppName | Out-Null
    Write-Host "✅ App $AppName exists" -ForegroundColor Green
} catch {
    Write-Host "🆕 Creating new Heroku app: $AppName" -ForegroundColor Yellow
    heroku create $AppName
}

# Set stack to container
Write-Host "🐳 Setting stack to container..." -ForegroundColor Blue
heroku stack:set container --app $AppName

# Set essential environment variables
Write-Host "⚙️ Setting environment variables..." -ForegroundColor Blue
heroku config:set NODE_ENV=production --app $AppName
heroku config:set NPM_CONFIG_PRODUCTION=false --app $AppName

# Build and push container
Write-Host "🔨 Building and pushing Docker container..." -ForegroundColor Blue
heroku container:push web --app $AppName

# Release the container
Write-Host "🚀 Releasing container..." -ForegroundColor Blue
heroku container:release web --app $AppName

# Open the app
Write-Host "🎉 Deployment complete! Opening app..." -ForegroundColor Green
heroku open --app $AppName

# Show useful commands
Write-Host ""
Write-Host "📊 Useful commands:" -ForegroundColor Cyan
Write-Host "View logs: heroku logs --tail --app $AppName" -ForegroundColor White
Write-Host "Check status: heroku ps --app $AppName" -ForegroundColor White
Write-Host "View config: heroku config --app $AppName" -ForegroundColor White
Write-Host "Scale dynos: heroku ps:scale web=1 --app $AppName" -ForegroundColor White

Write-Host ""
Write-Host "✅ Deployment script completed successfully!" -ForegroundColor Green
