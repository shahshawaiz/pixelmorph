# Use Node.js LTS version
FROM node:18-bullseye

# Set environment variable to ignore global libvips
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=1

# Install required dependencies for sharp
RUN apt-get update && apt-get install -y \
  build-essential \
  libc6-dev \
  libjpeg-dev \
  libpng-dev \
  libwebp-dev \
  libvips-dev \
  && rm -rf /var/lib/apt/lists/*  # Clean up apt cache to reduce image size

# Set the working directory
WORKDIR /app

# Copy application files
COPY app .

# Install application dependencies
RUN npm install

# Build the Next.js app (optional, uncomment if needed)
# RUN npm run build

# Expose the app port
EXPOSE 3000

# build the app
RUN npm run build

# Start the server
CMD ["npm", "start"]
