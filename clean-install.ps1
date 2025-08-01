# Simple Clean Install Script

Write-Host "🧹 Cleaning and reinstalling..." -ForegroundColor Green

# Clean everything
Remove-Item -Recurse -Force node_modules, package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force frontend/node_modules, frontend/package-lock.json -ErrorAction SilentlyContinue  
Remove-Item -Recurse -Force backend/node_modules, backend/package-lock.json -ErrorAction SilentlyContinue

# Install backend
Write-Host "Installing backend..." -ForegroundColor Yellow
cd backend
npm install
cd ..

# Install frontend  
Write-Host "Installing frontend..." -ForegroundColor Yellow
cd frontend
npm install
npm run build
cd ..

Write-Host "✅ Done! Ready to deploy." -ForegroundColor Green
