FROM ubuntu
ARG DEBIAN_FRONTEND=noninteractive
ENV DATABASE_URL=postgresql://postgres:postgres@localhost:5432/netloiter_ui

RUN apt-get update
RUN apt-get -y install gnupg postgresql-common
RUN yes | /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh
RUN apt-get update && apt-get install -y \
   postgresql-16 \
   postgresql-server-dev-16  \
   gcc \
   cmake \
   libssl-dev \
   libkrb5-dev \
   git \
   nano \
   nodejs \
   npm \
   curl

RUN npm install -g n
RUN n 18.17.1
RUN npm install -g prisma

COPY ./docker/db/entrypoint.sh /usr/local/bin
RUN chmod +x /usr/local/bin/entrypoint.sh

WORKDIR /usr/src/db
RUN git clone https://github.com/timescale/timescaledb/
RUN cd timescaledb/ && ./bootstrap
RUN cd timescaledb/./build && make
RUN cd timescaledb/./build && make install -j

USER postgres

RUN service postgresql start && \
   psql -U postgres -c "CREATE DATABASE netloiter_ui;" && \
   psql -U postgres -d netloiter_ui -c "ALTER SYSTEM SET listen_addresses TO '*';" && \
   psql -U postgres -d netloiter_ui -c "ALTER SYSTEM SET shared_preload_libraries TO 'timescaledb';" && \
   psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'postgres';"

RUN sed -i "s|# host    .*|host all all all password|g" /etc/postgresql/16/main/pg_hba.conf

# Sync db with prisma
COPY . ./temp

RUN service postgresql restart && \
    cd temp/server && prisma db push; exit 0

ENTRYPOINT ["entrypoint.sh"]

#EXPOSE 5432
