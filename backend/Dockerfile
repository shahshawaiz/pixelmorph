# Use an official Python runtime as a parent image
FROM python:3.10-bullseye

# Set the working directory in the container
WORKDIR /app

# Copy only the requirements file first to leverage Docker cache
COPY ./app/requirements.txt .

# Install the dependencies, add --no-cache-dir to avoid caching the package index
RUN pip install -r requirements.txt

# Copy the rest of the application code into the container
COPY ./app .

# Expose the desired ports
EXPOSE 8765
EXPOSE 8766
EXPOSE 8888

# make init.sh executable
RUN chmod +x ./init.sh

# run init
CMD ["sh", "./init.sh"]