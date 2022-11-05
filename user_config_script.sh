#!/bin/bash
curl https://get.docker.com | bash
cd /home/ubuntu/
apt install git -y
apt install docker-compose -y
git clone https://github.com/rstrom1763/Raspi_heart.git
chmod +x /home/ubuntu/Raspi_heart/start_raspi_server.sh