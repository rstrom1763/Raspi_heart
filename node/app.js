const fs = require('fs');
const express = require('express');
const app = express();

const config = JSON.parse(fs.readFileSync("./config.json", 'utf8'));

const { Server } = require("socket.io");
const io = new Server(config.socket_port);

app.use(express.json());
const nocache = require('nocache'); //Disable browser caching
//const { config } = require('process'); //Honestly not sure what this was used for if at all
app.use(nocache());
app.use(express.static('./'));
app.disable('etag', false); //Disable etag to help prevent http 304 issues
app.listen(config.port);
console.log('Listening on port ' + config.port + '... ');
heart_status = false;
socket_ids = []
sockets = []

//config = fs.readFileSync("./config.json", 'utf8');
//Read config file to memory into a json

app.get('/', (req, res) => {
    res.send(fs.readFileSync('./static/index.html', 'utf8'));
});

app.get('/getstatus', (req, res) => {
    if (heart_status) {
        res.send("Status: ON ");
    }
    if (!heart_status) {
        res.send("Status: OFF ");
    }
});

app.get('/toggle', (req, res) => {
    heart_status = !heart_status;
    if (heart_status) {
        res.send("Status: ON ");
    }
    if (!heart_status) {
        res.send("Status: OFF ");
    }
});

//For example only. Needs to be reworked for functionality
io.on("connection", (socket) => {
    sockets.push(socket);
    console.log(socket.handshake.query.id)
    socket.on("disconnect", () => {

        const index = sockets.indexOf(socket);
        if (index > -1) { // only splice array when item is found
            sockets.splice(index, 1); // 2nd parameter means remove one item only
        };

    });
});

