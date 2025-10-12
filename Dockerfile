# Stage 1 — Build the Vite app
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the code and build
COPY . .
RUN npm run build

# Stage 2 — Serve with Nginx
FROM nginx:alpine

# Copy the build output to Nginx's HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 to access from outside
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
