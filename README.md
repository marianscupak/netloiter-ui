# NetLoiter UI
Welcome to NetLoiter UI 👋 This project is a user interface for interacting with NetLoiter, a tool
designed to inject faults into network communication.

## Features
- **Intuitive Interface** 🚀 - The UI provides a user-friendly experience for configuring and managing fault injection parameters.
- **Fault Injection Control** 💉 - Easily specify the types of faults to inject, such as latency, packet loss, or corruption, and control their severity and duration.
- **Real-time Monitoring** 📈 - Monitor network performance metrics and observe the effects of fault injection in real-time through visual representations.
- **Saved Configurations** 📋 - Save and load configurations for quick and easy fault injection setup, enabling seamless experimentation and testing.

[//]: # (Docker v24.0.5, Docker Compose v2.20.3)

## Getting Started
1. **Clone the repository**: Clone this repository to your local machine using `git clone`.
2. **Configure environment variables**: Before building the Docker images, be sure to configure the necessary environment
   variables in `docker/compose.yaml` according to your environment. Variables not specified in the following list should not be modified.
   1. **NL_HOST_IP** - Specifies the IP address of the host machine where NetLoiter is deployed. 
   2. **NL_HOST_PORT** - Specifies the port number used for SSH communication on the NetLoiter host machine.
   3. **NL_HOST_USERNAME** - Set to the username of a user with root permissions on the NetLoiter host machine.
   4. **NL_HOST_PASSWORD** - Set to the password associated with the specified username.
   5. **NL_PATH** - Set this environment variable to the path of the `netloiter.py` script on the NetLoiter host machine.
   6. **NL_HOST_CONFIGS_PATH** - Should be set to the directory path on the NetLoiter host machine where the configuration files will be uploaded.
   7. **HOST_IP & DB_IP** - Should both be set to the same IP of the machine on which the docker containers will be running.
   These variables are used during the generation of configuration files to ignore the communication between components of the user interface.

3. **Build Docker images**: Navigate to the `docker` directory and build the Docker images for the app and the database using
`docker compose build`.
4. **Start the containers**: Once the images are built, start the Docker containers using `docker compose up`
5. **Access the UI**: The UI will be accessible in your web browser at `http://localhost:3000`, while the backend server
   will be listening on `http://localhost:2022` for API requests from the UI.
6. **Begin Fault Injection**: Start experimenting with fault injection by configuring the desired parameters within the UI and launching NetLoiter.
7. **Monitor Results**: Observe the effects of fault injection on network communication in real-time through the monitoring features provided by the UI.
8. **Stop Containers**: Once you're done, stop the Docker containers by pressing `Ctrl + C` in the terminal where `docker compose up` is running, or by running `docker compose down`.

## Used Technologies
- Project wide
  - TypeScript
  - Zod
  - tRPC
  - Jest
  - Cypress
- Frontend
  - React
  - MUI
  - Jotai
  - Tailwind CSS
  - Vite
- Backend
  - Express.js
  - Prisma
  - Sequelize
- Database
  - PostgreSQL
  - TimeScaleDB
- Other tools
  - Bun
  - ESLint
  - Docker
  - Docker Compose

## License
This project is licensed under the [MIT License](LICENSE).
