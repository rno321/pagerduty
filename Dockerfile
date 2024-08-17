# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Install MongoDB
RUN apk add --no-cache mongodb

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application to the container
COPY . .

# Build the Next.js app
RUN npm run build

# Create a directory for MongoDB data and mount it to a Docker volume
VOLUME /data/db

# Expose the ports the app and MongoDB will run on
EXPOSE 3000 27017

# Start MongoDB and the Next.js app
CMD ["sh", "-c", "mongod --dbpath /data/db --bind_ip_all & npm run start"]
