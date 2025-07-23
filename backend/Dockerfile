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

