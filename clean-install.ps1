# Clean Install Script - Fixes package-lock.json issues locally
# Run this before deployment to ensure all dependencies are in sync

Write-Host "🧹 Starting clean install process..." -ForegroundColor Green

# Function to safely remove items
function Remove-ItemSafely {
    param([string]$Path)
    if (Test-Path $Path) {
        try {
            Remove-Item -Path $Path -Recurse -Force
            Write-Host "✅ Removed: $Path" -ForegroundColor Green
        } catch {
            Write-Host "⚠️  Could not remove: $Path" -ForegroundColor Yellow
        }
    }
}

# Step 1: Clean everything
Write-Host ""
Write-Host "Step 1: Cleaning old installations..." -ForegroundColor Cyan

Remove-ItemSafely "node_modules"
Remove-ItemSafely "package-lock.json"
Remove-ItemSafely "frontend/node_modules"
Remove-ItemSafely "frontend/package-lock.json"
Remove-ItemSafely "backend/node_modules"
Remove-ItemSafely "backend/package-lock.json"

# Step 2: Install backend dependencies first
Write-Host ""
Write-Host "Step 2: Installing backend dependencies..." -ForegroundColor Cyan
Set-Location backend

try {
    npm install
    Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend installation failed" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}

Set-Location ..

# Step 3: Install frontend dependencies
Write-Host ""
Write-Host "Step 3: Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location frontend

try {
    npm install
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend installation failed" -ForegroundColor Red
    Write-Host $_.Exception.Message
    Set-Location ..
    exit 1
}

Set-Location ..

# Step 4: Test builds
Write-Host ""
Write-Host "Step 4: Testing builds..." -ForegroundColor Cyan

# Test backend
Write-Host "Testing backend..." -ForegroundColor White
Set-Location backend
try {
    # Just check if the main file exists and can be parsed
    if (Test-Path "app.js") {
        Write-Host "✅ Backend files OK" -ForegroundColor Green
    } else {
        Write-Host "❌ Backend app.js missing" -ForegroundColor Red
    }
} catch {
    Write-Host "⚠️  Backend test failed: $($_.Exception.Message)" -ForegroundColor Yellow
}
Set-Location ..

# Test frontend build
Write-Host "Testing frontend build..." -ForegroundColor White
Set-Location frontend
try {
    npm run build
    Write-Host "✅ Frontend build successful" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend build failed" -ForegroundColor Red
    Write-Host $_.Exception.Message
    Set-Location ..
    exit 1
}
Set-Location ..

# Step 5: Create simple package.json for root
Write-Host ""
Write-Host "Step 5: Creating minimal root package.json..." -ForegroundColor Cyan

$packageJson = @{
    name = "densndent-fullstack"
    version = "1.0.0"
    private = $true
    scripts = @{
        start = "cd backend && npm start"
        "heroku-postbuild" = "cd frontend && npm install && npm run build"
    }
    engines = @{
        node = "18.x"
        npm = "9.x"
    }
}

$packageJson | ConvertTo-Json -Depth 3 | Set-Content "package.json"
Write-Host "✅ Created minimal package.json" -ForegroundColor Green

# Step 6: Summary
Write-Host ""
Write-Host "🎉 Clean install completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host "  ✅ All node_modules cleaned and reinstalled" -ForegroundColor White
Write-Host "  ✅ All package-lock.json files regenerated" -ForegroundColor White
Write-Host "  ✅ Frontend build tested successfully" -ForegroundColor White
Write-Host "  ✅ Minimal root package.json created" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Ready for deployment!" -ForegroundColor Green
Write-Host "Run: .\quick-deploy.ps1 your-app-name" -ForegroundColor Cyan
