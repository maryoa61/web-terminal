FROM node:20-slim
RUN apt-get update && apt-get install -y python3 make g++
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
