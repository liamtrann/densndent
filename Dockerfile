# Multi-stage build for production
FROM node:18-alpine AS frontend-build

# Set working directory for frontend build
WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm ci --only=production

# Copy frontend source code
COPY frontend/ ./

# Build the React app
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./

# Install backend dependencies
RUN npm ci --only=production

# Copy backend source code
COPY backend/ ./

# Copy built frontend from previous stage
COPY --from=frontend-build /app/frontend/build ./public

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE $PORT

# Start the application
CMD ["node", "app.js"]
