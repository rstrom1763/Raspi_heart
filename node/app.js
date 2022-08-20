const fs = require('fs');
const express = require('express');
const app = express();

//Read config into memory and parse as json for use by program
const config = JSON.parse(fs.readFileSync("./config.json", 'utf8'));

//Create the socketio server and define listening port
const { Server } = require("socket.io");
const io = new Server(config.socket_port);

app.use(express.json());
const nocache = require('nocache'); //Disable browser caching
app.use(nocache());
app.use(express.static('./'));
app.disable('etag', false); //Disable etag to help prevent http 304 issues
app.listen(config.port);
console.log('Listening on port ' + config.port + '... ');
heart_status = false;
text_value = false;

//Send the html page for the web gui
app.get('/', (req, res) => {
    res.send(fs.readFileSync('./static/index.html', 'utf8'));
});

//Sends the current status of the pi
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

//Route that toggles the heart on or off
app.get('/toggle', (req, res) => {
    heart_status = !heart_status;
    if (heart_status) {
        res.send("Status: Heart ON ");
    }
    if (!heart_status) {
        res.send("Status: Heart OFF ");
    }

    //Text will always be false since this toggles the heart
    text_value = false

    io.sockets.emit('setstatus', { "heart_status": heart_status, "text_value": text_value });
});

//Sets that value of the message to be shown
app.post('/setmessage', (req, res) => {
    text_value = req.headers.text_value
    heart_status = false
    res.send("Showing message: " + text_value)
    io.sockets.emit('setstatus', { "heart_status": heart_status, "text_value": text_value });
});

//Web socket responses are defined in here
io.on("connection", (socket) => {

    //Sends the status of the heart and message
    socket.on("getstatus", () => {
        socket.emit("setstatus", { "heart_status": heart_status, "text_value": text_value });
    });

});
