#!/bin/bash
# Docker Management Script for DensNDent

case "$1" in
  "build")
    echo "🔨 Building all Docker images..."
    docker compose build
    ;;
  
  "up")
    echo "🚀 Starting all services..."
    docker compose up -d
    ;;
  
  "down")
    echo "🛑 Stopping all services..."
    docker compose down
    ;;
  
  "logs")
    if [ -z "$2" ]; then
      echo "📋 Showing logs for all services..."
      docker compose logs -f
    else
      echo "📋 Showing logs for $2..."
      docker compose logs -f "$2"
    fi
    ;;
  
  "restart")
    if [ -z "$2" ]; then
      echo "🔄 Restarting all services..."
      docker compose restart
    else
      echo "🔄 Restarting $2..."
      docker compose restart "$2"
    fi
    ;;
  
  "status")
    echo "📊 Service status:"
    docker compose ps
    ;;
  
  "clean")
    echo "🧹 Cleaning up..."
    docker compose down -v
    docker system prune -f
    ;;
  
  *)
    echo "🐳 DensNDent Docker Management"
    echo ""
    echo "Usage: $0 {build|up|down|logs|restart|status|clean}"
    echo ""
    echo "Commands:"
    echo "  build    - Build all Docker images"
    echo "  up       - Start all services"
    echo "  down     - Stop all services"
    echo "  logs     - Show logs (optionally specify service name)"
    echo "  restart  - Restart services (optionally specify service name)"
    echo "  status   - Show service status"
    echo "  clean    - Stop services and clean up volumes"
    echo ""
    echo "Examples:"
    echo "  $0 build"
    echo "  $0 up"
    echo "  $0 logs backend"
    echo "  $0 restart frontend"
    ;;
esac
