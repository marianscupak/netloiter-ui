#!/bin/bash

root_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" || exit ; pwd -P )

sudo docker compose -f "$root_path/docker/compose.yaml" up --build
