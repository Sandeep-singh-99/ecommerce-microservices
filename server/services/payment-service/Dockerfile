# FROM node:22-alpine

# # Set working directory
# WORKDIR /app

# # Copy package files and install dependencies
# COPY payment-service/package*.json ./
# # RUN npm install --production
# RUN npm install

# # Copy the rest of the application code
# # COPY . .
# COPY payment-service/ .

# # Expose the port your app runs on
# EXPOSE 5000

# # Start the server
# CMD ["node", "server.js"]


FROM node:22-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
# Note: Path is relative to the build context (./server)
COPY services/payment-service/package*.json ./
RUN npm install

# Copy the rest of the application code
COPY services/payment-service/ .

# Expose the port your app runs on
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]