FROM node:21.6.2

# Set up the working directory in the container
WORKDIR /app

# Copy the project files into the container
COPY . .

# Install the Node.js dependencies
RUN npm install

# Expose the ports for the frontend application
EXPOSE 5000
EXPOSE 5173
EXPOSE 6379

# Run the development server
CMD ["npm", "run", "dev", "--", "--host"]