# Use Node.js LTS Alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /srv/app

# Copy the rest of the application
COPY app .

# Install dependencies with specific flags for Sharp
RUN npm install


# Build the Strapi admin panel
RUN npm run build

# Expose Strapi default port
EXPOSE 1337

# Start Strapi
CMD ["npm", "run", "develop"]