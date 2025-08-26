FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
ENV PORT=8080
ENV REGISTRY_PATH=/data/registry/apps.json
EXPOSE 8080
CMD ["npm","start"]
