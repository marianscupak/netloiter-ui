FROM oven/bun:1-debian as base

RUN apt-get update
RUN apt-get -y install curl
RUN apt-get -y install gcc nodejs npm
RUN npm install -g n
RUN n 18.17.1

# Setup project
FROM base AS release
WORKDIR /usr/src/app
COPY . .

RUN bun i --ignore-scripts
RUN bunx prisma
RUN cd server && bunx prisma generate

EXPOSE 3000 2022
ENTRYPOINT ["bun", "dev"]
