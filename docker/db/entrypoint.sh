#!/bin/bash
service postgresql start
psql -X -d netloiter_ui -c "CREATE EXTENSION IF NOT EXISTS timescaledb;"
sleep infinity
