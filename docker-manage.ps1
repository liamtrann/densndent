# Docker Management Script for DensNDent (PowerShell)
param(
    [Parameter(Mandatory = $true)]
    [string]$Command,
    
    [Parameter(Mandatory = $false)]
    [string]$Service
)

switch ($Command.ToLower()) {
    "build" {
        Write-Host "🔨 Building all Docker images..." -ForegroundColor Yellow
        docker compose build
    }
    
    "up" {
        Write-Host "🚀 Starting all services..." -ForegroundColor Green
        docker compose up -d
    }
    
    "down" {
        Write-Host "🛑 Stopping all services..." -ForegroundColor Red
        docker compose down
    }
    
    "logs" {
        if ([string]::IsNullOrEmpty($Service)) {
            Write-Host "📋 Showing logs for all services..." -ForegroundColor Cyan
            docker compose logs -f
        }
        else {
            Write-Host "📋 Showing logs for $Service..." -ForegroundColor Cyan
            docker compose logs -f $Service
        }
    }
    
    "restart" {
        if ([string]::IsNullOrEmpty($Service)) {
            Write-Host "🔄 Restarting all services..." -ForegroundColor Yellow
            docker compose restart
        }
        else {
            Write-Host "🔄 Restarting $Service..." -ForegroundColor Yellow
            docker compose restart $Service
        }
    }
    
    "status" {
        Write-Host "📊 Service status:" -ForegroundColor Blue
        docker compose ps
    }
    
    "clean" {
        Write-Host "🧹 Cleaning up..." -ForegroundColor Magenta
        docker compose down -v
        docker system prune -f
    }
    
    default {
        Write-Host "🐳 DensNDent Docker Management" -ForegroundColor White
        Write-Host ""
        Write-Host "Usage: .\docker-manage.ps1 -Command {build|up|down|logs|restart|status|clean} [-Service <service_name>]" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Commands:" -ForegroundColor White
        Write-Host "  build    - Build all Docker images" -ForegroundColor Gray
        Write-Host "  up       - Start all services" -ForegroundColor Gray
        Write-Host "  down     - Stop all services" -ForegroundColor Gray
        Write-Host "  logs     - Show logs (optionally specify service name)" -ForegroundColor Gray
        Write-Host "  restart  - Restart services (optionally specify service name)" -ForegroundColor Gray
        Write-Host "  status   - Show service status" -ForegroundColor Gray
        Write-Host "  clean    - Stop services and clean up volumes" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Examples:" -ForegroundColor White
        Write-Host "  .\docker-manage.ps1 -Command build" -ForegroundColor Gray
        Write-Host "  .\docker-manage.ps1 -Command up" -ForegroundColor Gray
        Write-Host "  .\docker-manage.ps1 -Command logs -Service backend" -ForegroundColor Gray
        Write-Host "  .\docker-manage.ps1 -Command restart -Service frontend" -ForegroundColor Gray
    }
}
