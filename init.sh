#!/bin/bash

# Check if Docker and Docker Compose is already installed
if ! (command -v docker &>/dev/null || command docker compose version &>/dev/null); then
    echo "Docker or Docker Compose is not installed, installing..."

    # Add Docker's official GPG key:
    sudo apt-get update
    sudo apt-get -y install ca-certificates curl
    sudo install -m 0755 -d /etc/apt/keyrings
    sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    sudo chmod a+r /etc/apt/keyrings/docker.asc

    # Add the repository to Apt sources:
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update

    # Install Docker
    sudo apt-get -y install docker-ce docker-ce-cli containerd containerd.io docker-buildx-plugin docker-compose-plugin
fi

if ! (command -v docker &>/dev/null || ! command docker compose version &>/dev/null); then
    echo "Docker or Docker Compose were not installed successfully."
    exit 1
fi

# Display Docker versions
docker_version=$(docker --version)
docker_compose_version=$(docker compose version)

echo "Docker version: $docker_version"
echo "Docker Compose version: $docker_compose_version"

echo ""
# Check if Git is installed
if ! command -v git &>/dev/null; then
    echo "Git is not installed, installing..."
    sudo apt-get update
    sudo apt-get -y install git
    echo "Git installed successfully."
else
    echo "Git is already installed."
fi

echo ""
root_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" || exit ; pwd -P )
# Check if NetLoiter directory already exists
netloiter_dir="lib/netloiter"
if [ -d "$netloiter_dir" ]; then
    echo "NetLoiter is already downloaded in $root_path/$netloiter_dir."
else
    # Clone the repository
    git clone https://pajda.fit.vutbr.cz/testos/netloiter.git "$root_path/$netloiter_dir"
    echo "NetLoiter cloned successfully. Installing NetLoiter dependencies..."
    sudo "$root_path/$netloiter_dir/install/install.sh"
fi

echo ""
# Create a .env file from the template if it doesn't exist yet
if [ -e "$root_path/docker/.env" ]; then
    echo "The .env file already exists in $root_path/docker. Make sure it is populated with the required variables based on your environment. Refer to the README.md for guidance."
else
    cp "$root_path/docker/.env.example" "$root_path/docker/.env"
    sed -i "s|NL_PATH=.*|NL_PATH=$root_path/$netloiter_dir/netloiter.py|" "$root_path/docker/.env"
    sed -i "s|NL_HOST_CONFIGS_PATH=.*|NL_HOST_CONFIGS_PATH=$root_path/$netloiter_dir|" "$root_path/docker/.env"
    echo "Successfully created a .env file in $root_path/docker. Please populate the file with the required variables based on your environment. Refer to the README.md for guidance."
fi
