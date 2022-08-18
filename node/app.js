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
text_value = false;

//config = fs.readFileSync("./config.json", 'utf8');
//Read config file to memory into a json

app.get('/', (req, res) => {
    res.send(fs.readFileSync('./static/index.html', 'utf8'));
});

app.get('/getstatus', (req, res) => {
    if (heart_status) {
        res.send("Status: Heart ON ");
    };
    if (!heart_status && text_value === false) {
        res.send("Status: Heart OFF ");
    };
    if (!heart_status && text_value != false) {
        res.send("Showing message: " + text_value)
    };
});

app.get('/toggle', (req, res) => {
    heart_status = !heart_status;
    if (heart_status) {
        res.send("Status: Heart ON ");
    }
    if (!heart_status) {
        res.send("Status: Heart OFF ");
    }
    text_value = false

    io.sockets.emit('setstatus', { "heart_status": heart_status, "text_value": text_value });
});

app.post('/setmessage', (req, res) => {
    console.log(req.headers.text_value)
    text_value = req.headers.text_value
    heart_status = false
    res.send("Showing message: " + text_value)
    io.sockets.emit('setstatus', { "heart_status": heart_status, "text_value": text_value });
});

io.on("connection", (socket) => {

    socket.on("getstatus", () => {
        socket.emit("setstatus", { "heart_status": heart_status, "text_value": text_value });
    });

});

