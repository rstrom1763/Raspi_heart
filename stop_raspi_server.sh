#!/bin/bash

chmod +x start_raspi_server.sh
docker-compose down
docker image rm raspi_heart