# Use an official Python runtime as a parent image
FROM python:3.10-bullseye

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    DEBIAN_FRONTEND=noninteractive

# Set the working directory in the container
WORKDIR /app

# Install system dependencies and FFmpeg
# Install system dependencies and FFmpeg
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    libsm6 \
    libxext6 \
    libgl1-mesa-glx \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

    
# Copy only the requirements file first to leverage Docker cache
COPY ./app/requirements.txt .

# Install the dependencies, add --no-cache-dir to avoid caching the package index
RUN pip install -r requirements.txt

# Copy the rest of the application code into the container
COPY ./app .

# Expose the desired ports
EXPOSE 443

# make init.sh executable
RUN chmod +x ./init.sh

# run init
CMD ["sh", "./init.sh"]