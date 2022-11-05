#!/bin/bash
echo "Success" > /testing.txt
if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi
cd $(cat /var/path.txt)
python3 /etc/PiClient.py
