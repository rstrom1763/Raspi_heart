#!/bin/bash

chmod +x stop_raspi_server.sh
docker build -t raspi_heart .
docker-compose up -d