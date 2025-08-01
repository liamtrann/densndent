#!/bin/bash

# Heroku Docker Deployment Script
# Run this script to deploy your app to Heroku using Docker

set -e

echo "🚀 Starting Heroku Docker deployment..."

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI is not installed. Please install it first."
    echo "Download from: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Check if logged in to Heroku
if ! heroku auth:whoami &> /dev/null; then
    echo "📝 Please login to Heroku first:"
    heroku login
fi

# Check if app name is provided
if [ -z "$1" ]; then
    echo "❌ Please provide your Heroku app name"
    echo "Usage: ./deploy.sh <your-app-name>"
    exit 1
fi

APP_NAME=$1

echo "📦 App name: $APP_NAME"

# Login to Heroku Container Registry
echo "🔐 Logging in to Heroku Container Registry..."
heroku container:login

# Check if app exists, if not create it
if ! heroku apps:info $APP_NAME &> /dev/null; then
    echo "🆕 Creating new Heroku app: $APP_NAME"
    heroku create $APP_NAME
else
    echo "✅ App $APP_NAME already exists"
fi

# Set stack to container
echo "🐳 Setting stack to container..."
heroku stack:set container --app $APP_NAME

# Set environment variables (you can modify these)
echo "⚙️ Setting environment variables..."
heroku config:set NODE_ENV=production --app $APP_NAME
# Add more environment variables as needed:
# heroku config:set AUTH0_DOMAIN=your_domain --app $APP_NAME
# heroku config:set AUTH0_CLIENT_ID=your_client_id --app $APP_NAME

# Build and push Docker image
echo "🔨 Building and pushing Docker image..."
heroku container:push web --app $APP_NAME

# Release the image
echo "🚀 Releasing the image..."
heroku container:release web --app $APP_NAME

# Open the app
echo "🎉 Deployment complete! Opening app..."
heroku open --app $APP_NAME

echo "✅ Deployment finished successfully!"
echo "📊 You can check logs with: heroku logs --tail --app $APP_NAME"
echo "🔧 You can check app status with: heroku ps --app $APP_NAME"
