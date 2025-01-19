sudo yum install docker -y

sudo service docker start

sudo usermod -a -G docker ec2-user

sudo yum install git -y

git clone https://github.com/shahshawaiz/pixelmorph.git

sudo curl -SL https://github.com/docker/compose/releases/download/v2.5.0/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

docker-compose version

sudo yum install -y libxcrypt-compat

cd pixelmorph/

# Define the content of the .env file
env_content_frontend="NEXT_PUBLIC_API_URL=http://backend:8765
NEXT_PUBLIC_ADMIN_USERNAME=shawaiz.REDACTED
NEXT_PUBLIC_ADMIN_PASSWORD=REDACTED
NEXT_PUBLIC_HF_TOKEN=REDACTED"

# Write the content to the .env file
echo "$env_content_frontend" > frontend/.env

docker-compose -f docker-compose.yml up --build