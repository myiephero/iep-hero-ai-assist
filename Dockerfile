# Use the official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the current directory contents into the container at /app
COPY . .

# Build the application
RUN npm run build

# Make port configurable via environment variable
ENV PORT=5000

# Expose the port the app runs on
EXPOSE 5000

# Define the command to run the application
CMD ["node", "server-js.js"]