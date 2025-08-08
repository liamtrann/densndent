# Multi-stage build for production
FROM node:18-alpine AS frontend-build

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Set working directory for frontend build
WORKDIR /app

# Copy package files first for better Docker layer caching
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install frontend dependencies
WORKDIR /app/frontend
RUN npm install --only=production --no-audit --no-fund

# Copy frontend source code and build
COPY frontend/ ./
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./

# Install backend dependencies
RUN npm install --only=production --no-audit --no-fund && \
    npm cache clean --force

# Copy backend source code
COPY backend/ ./

# Copy built frontend from previous stage
COPY --from=frontend-build /app/frontend/build ./public

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of the app directory to nodejs user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port (Heroku sets this dynamically)
EXPOSE $PORT

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "app.js"]
