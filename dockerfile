FROM node:latest
COPY ./node /app
WORKDIR /app
RUN npm i && \
    apt update && \
    apt install openssl -y && \
    openssl req -newkey rsa:2048 -new -nodes -x509 \
    -subj "/C=US/ST=Denial/L=Springfield/O=Dis/CN=www.example.com" \
    -days 3650 \
    -keyout key.pem -out cert.pem
CMD node /app/app.js