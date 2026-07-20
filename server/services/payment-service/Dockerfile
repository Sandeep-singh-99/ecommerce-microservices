FROM node:22

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
# Note: Path is relative to the build context (./server)
COPY services/payment-service/package*.json ./
RUN npm install

# Copy the rest of the application code
COPY services/payment-service/ .

# Generate Prisma Client for container binaryTarget
RUN npx prisma generate

# Expose the port your app runs on
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]