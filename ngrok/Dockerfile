# Use the official ngrok image from the Docker Hub
FROM ngrok/ngrok:latest

# Copy the ngrok configuration file into the container
COPY ./config/ngrok.yml /etc/ngrok.yml

# Define the command to run ngrok with the provided configuration
CMD ["ngrok", "start", "--all", "--config", "/etc/ngrok.yml"]

# Expose the port specified in the configuration
EXPOSE 4000

# Set the network mode to host
# Note: Dockerfiles do not directly support setting network mode; this must be done in the docker-compose file or when running the container.
# Use the official ngrok image from the Docker Hub
FROM ngrok/ngrok:latest

# Copy the ngrok configuration file into the container
COPY ./config/ngrok.yml /etc/ngrok.yml

# Define the command to run ngrok with the provided configuration
CMD ["ngrok", "start", "--all", "--config", "/etc/ngrok.yml"]

# Expose the port specified in the configuration
EXPOSE 4000
