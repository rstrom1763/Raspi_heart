FROM node:latest
COPY ./node /app
WORKDIR /app
RUN npm i
CMD node /app/app.js