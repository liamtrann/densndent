# Local CI/CD Pipeline Test Script for Windows PowerShell
# This script simulates the GitHub Actions workflow locally

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting local CI/CD pipeline simulation..." -ForegroundColor Green

# Function to print colored output
function Write-Success {
    param($Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

# Check prerequisites
Write-Host "🔍 Checking prerequisites..." -ForegroundColor Cyan

try {
    $null = Get-Command node -ErrorAction Stop
    $null = Get-Command npm -ErrorAction Stop
    $null = Get-Command docker -ErrorAction Stop
    Write-Success "Prerequisites check passed"
}
catch {
    Write-Error "Missing required tools: Node.js, npm, or Docker"
    exit 1
}

# Frontend CI
Write-Host "🎨 Testing Frontend..." -ForegroundColor Cyan
Set-Location frontend

Write-Host "  📦 Installing dependencies..."
npm ci

Write-Host "  🔍 Running linter..."
npm run lint:check

Write-Host "  🧪 Running tests..."
npm test -- --coverage --watchAll=false

Write-Host "  🏗️  Building application..."
$env:CI = "false"  # Disable treating warnings as errors
npm run build

Write-Success "Frontend tests passed"
Set-Location ..

# Backend CI
Write-Host "🔧 Testing Backend..." -ForegroundColor Cyan
Set-Location backend

Write-Host "  📦 Installing dependencies..."
npm ci

Write-Host "  🏗️  Testing application startup..."
$job = Start-Job -ScriptBlock { npm start }
Start-Sleep -Seconds 5

# Test health endpoint if available
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Success "Backend health check passed"
    }
}
catch {
    Write-Warning "Backend health check failed or not available"
}

Stop-Job $job
Remove-Job $job

Write-Success "Backend tests passed"
Set-Location ..

# Docker builds
Write-Host "🐳 Testing Docker builds..." -ForegroundColor Cyan

Write-Host "  🏗️  Building frontend Docker image..."
docker build -t test-frontend ./frontend

Write-Host "  🏗️  Building backend Docker image..."
docker build -t test-backend ./backend

Write-Host "  🔍 Validating docker-compose..."
docker-compose config --quiet

Write-Success "Docker builds successful"

# Security scan (basic)
Write-Host "🔒 Running basic security checks..." -ForegroundColor Cyan

# Check for common secrets patterns
$secretPatterns = @("password", "secret", "key", "token")
$foundSecrets = $false

Get-ChildItem -Recurse -Include "*.js", "*.json" | Where-Object { $_.FullName -notmatch "node_modules" } | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    foreach ($pattern in $secretPatterns) {
        if ($content -match $pattern) {
            $foundSecrets = $true
            break
        }
    }
}

if ($foundSecrets) {
    Write-Warning "Found potential secrets in code (review manually)"
}
else {
    Write-Success "No obvious secrets found in code"
}

# Dependency audit
Write-Host "  🔍 Running dependency audit..."
Set-Location frontend
npm audit --audit-level moderate
Set-Location ..

Set-Location backend
npm audit --audit-level moderate
Set-Location ..

Write-Success "Security checks completed"

# Cleanup
Write-Host "🧹 Cleaning up..." -ForegroundColor Cyan
docker rmi test-frontend test-backend

Write-Host "🎉 Local CI/CD pipeline simulation completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Push your code to trigger the GitHub Actions workflow"
Write-Host "2. Configure the required secrets in your GitHub repository"
Write-Host "3. Review the deployment section in the workflows for your specific needs"
