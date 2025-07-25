<<<<<<< HEAD
# Backend Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/health', (res) => { \
    if (res.statusCode === 200) process.exit(0); else process.exit(1); \
    }).on('error', () => process.exit(1));"

# Start the application
CMD ["npm", "start"]
=======
# Node.js application stage
FROM node:18-alpine AS app

WORKDIR /backend

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

# Production stage with Nginx
FROM nginx:alpine

# Install Node.js in the nginx container
RUN apk add --no-cache nodejs npm

# Copy the Node.js app
COPY --from=app /backend /backend
WORKDIR /backend

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a startup script
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'cd /backend && npm start &' >> /start.sh && \
    echo 'nginx -g "daemon off;"' >> /start.sh && \
    chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]

>>>>>>> ab8b0fe728acbfc023271ae39f5b350bbca93d60
