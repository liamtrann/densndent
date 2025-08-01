# Quick Deploy Script - Bypasses package-lock issues
# Uses alternative Dockerfile and simplified approach

param(
    [Parameter(Mandatory=$true)]
    [string]$AppName
)

Write-Host "🚀 Quick Deploy - Bypassing package-lock issues..." -ForegroundColor Green

# Check Heroku login
try {
    heroku auth:whoami | Out-Null
} catch {
    heroku login
}

# Container login
heroku container:login

# Create app if needed
try {
    heroku apps:info $AppName | Out-Null
    Write-Host "✅ App exists: $AppName" -ForegroundColor Green
} catch {
    Write-Host "🆕 Creating app: $AppName" -ForegroundColor Yellow
    heroku create $AppName
}

# Set container stack
heroku stack:set container --app $AppName

# Set environment variables
Write-Host "⚙️ Setting environment variables..." -ForegroundColor Blue
heroku config:set NODE_ENV=production --app $AppName
heroku config:set NPM_CONFIG_PRODUCTION=false --app $AppName

# Create temporary heroku.yml for alternative dockerfile
$herokuYml = @"
build:
  docker:
    web: Dockerfile.alternative
run:
  web: node app.js
"@

Set-Content -Path "heroku-alt.yml" -Value $herokuYml

# Copy to heroku.yml temporarily
Copy-Item "heroku-alt.yml" "heroku.yml" -Force

Write-Host "🔨 Building with alternative Dockerfile..." -ForegroundColor Blue
heroku container:push web --app $AppName

Write-Host "🚀 Releasing..." -ForegroundColor Blue
heroku container:release web --app $AppName

# Cleanup
Remove-Item "heroku-alt.yml" -ErrorAction SilentlyContinue

Write-Host "🎉 Quick deployment complete!" -ForegroundColor Green
heroku open --app $AppName

Write-Host ""
Write-Host "📊 Check status: heroku logs --tail --app $AppName" -ForegroundColor Cyan
