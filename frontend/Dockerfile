<<<<<<< HEAD
# Frontend Dockerfile - Multi-stage build
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app to nginx directory
COPY --from=build /app/build /usr/share/nginx/html

# Create nginx configuration
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    location / { \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    try_files $uri $uri/ /index.html; \
    } \
    location /static/ { \
    root /usr/share/nginx/html; \
    expires 1y; \
    add_header Cache-Control "public, immutable"; \
    } \
    location /api/ { \
    proxy_pass http://backend:3001/; \
    proxy_http_version 1.1; \
    proxy_set_header Upgrade $http_upgrade; \
    proxy_set_header Connection 'upgrade'; \
    proxy_set_header Host $host; \
    proxy_set_header X-Real-IP $remote_addr; \
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
    proxy_set_header X-Forwarded-Proto $scheme; \
    proxy_cache_bypass $http_upgrade; \
    } \
    }' > /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
=======
# Build stage
FROM node:18-alpine AS build

WORKDIR /frontend

# Accept build arguments
ARG REACT_APP_API_BASE_URL
ARG REACT_APP_AUTH0_DOMAIN
ARG REACT_APP_AUTH0_CLIENT_ID
ARG REACT_APP_AUTH0_AUDIENCE
ARG BASE_FILE_URL_FOR_IMG
ARG REACT_APP_NO_IMAGE_AVAILABLE_LOGO

ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
ENV REACT_APP_AUTH0_DOMAIN=$REACT_APP_AUTH0_DOMAIN
ENV REACT_APP_AUTH0_CLIENT_ID=$REACT_APP_AUTH0_CLIENT_ID
ENV REACT_APP_AUTH0_AUDIENCE=$REACT_APP_AUTH0_AUDIENCE
ENV BASE_FILE_URL_FOR_IMG=$BASE_FILE_URL_FOR_IMG
ENV REACT_APP_NO_IMAGE_AVAILABLE_LOGO=$REACT_APP_NO_IMAGE_AVAILABLE_LOGO

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine

COPY --from=build /frontend/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

>>>>>>> ab8b0fe728acbfc023271ae39f5b350bbca93d60
CMD ["nginx", "-g", "daemon off;"]