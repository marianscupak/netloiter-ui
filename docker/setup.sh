#!/bin/bash

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

sudo apt-get -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

docker_version=$(docker --version)
docker_compose_version=$(docker compose version)

echo "Docker version: $docker_version"
echo "Docker Compose version: $docker_compose_version"

docker_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
root_path=$( dirname "$docker_path" )

git clone https://pajda.fit.vutbr.cz/testos/netloiter.git "$root_path/lib/netloiter"
