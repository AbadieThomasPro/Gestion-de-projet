# Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/package.json backend/
COPY frontend/package.json frontend/
RUN npm ci -w backend
COPY backend backend
RUN npm run build -w backend

# Run (only production dependencies)
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
COPY backend/package.json backend/
COPY frontend/package.json frontend/
RUN npm ci -w backend --omit=dev
COPY backend/next.config.js backend/
COPY --from=build /app/backend/.next backend/.next
EXPOSE 3001
CMD ["npm", "start", "-w", "backend"]
