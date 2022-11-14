const fs = require('fs');
const http = require('http')
const https = require('https')
const express = require('express');
const app = express();
const { urlencoded } = require('body-parser');
const process = require('process')
const dotenv = require('dotenv')
dotenv.config({ path: "./.env" });


//Create the socketio server and define listening port
const { Server } = require("socket.io");
const io = new Server(process.env.SOCKET_PORT);


app.use(express.json());
app.use(urlencoded({ extended: false }));
const nocache = require('nocache'); //Disable browser caching
app.use(nocache());
app.use(express.static('./'));
app.disable('etag', false); //Disable etag to help prevent http 304 issues
socket_list = {}
statuses = {};


if (process.env.PROTOCOL === "https") {
    https.createServer({
        key: fs.readFileSync('key.pem'),
        cert: fs.readFileSync('cert.pem')
    }, app).listen(process.env.PORT, () => {
        console.log("Listening https on port " + process.env.PORT + "...")
    });
} else if (process.env.PROTOCOL === "http") {
    app.listen(process.env.PORT, () => {
        console.log("Listening http on port " + process.env.PORT + "...")
    });
} else {
    console.log("Invalid protocol! Exiting! ")
    process.exit()
}


//Sends the current status of the pi
app.get('/getstatus', (req, res) => {
    api_key = req.headers.api_key;
    heart_status = statuses[api_key].heart_status
    text_value = statuses[api_key].text_value
    if (heart_status === true) {
        res.send("Status: Heart ON ");
    };
    if (heart_status === false && text_value === false) {
        res.send("Status: Heart OFF ");
    };
    if (heart_status === false && text_value !== false) {
        res.send("Showing message: \"" + text_value + "\"")
    };
});


//Route that toggles the heart on or off
app.get('/toggle', (req, res) => {
    api_key = req.headers.api_key;
    statuses[api_key].heart_status = !statuses[api_key].heart_status
    statuses[api_key].text_value = false;
    heart_status = statuses[api_key].heart_status
    text_value = statuses[api_key].text_value
    if (heart_status) {
        res.send("Status: Heart ON ");
    }
    if (heart_status === false) {
        res.send("Status: Heart OFF ");
    }

    //Send the new status to the Pi so it can act on the new status
    socket_list[api_key].emit('setstatus', { "heart_status": heart_status, "text_value": text_value });
});


//Route to turn the pi message or heart off
app.post('/off', (req, res) => {
    api_key = req.headers.api_key;
    statuses[api_key].heart_status = false;
    statuses[api_key].text_value = false;
    heart_status = statuses[api_key].heart_status;
    text_value = statuses[api_key].text_value;
    socket_list[api_key].emit('setstatus', { "heart_status": heart_status, "text_value": text_value });
    res.send('Success')
});


//Sets that value of the message to be shown
app.post('/setmessage', (req, res) => {
    api_key = req.headers.api_key;
    statuses[api_key].heart_status = false;
    statuses[api_key].text_value = req.headers.text_value;
    text_value = statuses[api_key].text_value
    heart_status = statuses[api_key].heart_status

    //Send new message to the pi through the websocket connection
    socket_list[api_key].emit('setstatus', { "heart_status": heart_status, "text_value": text_value });

    //Write message to log file
    fs.appendFile('./messages.log', req.headers.text_value + '\n', (err) => {
        if (err) { err };
    });

    //Send the gui the status message to display
    res.send("Showing message: \"" + text_value + "\"")
});


//To be used by an ELB to check for health status
app.get('/health', (req, res) => {
    res.send("Healthy!")
});


//Web socket responses are defined in here
io.on("connection", (socket) => {

    //Message sent when pi connects to get current status
    socket.on("getstatus", (data) => {
        if (!(data.api_key in statuses)) {
            statuses[data.api_key] = { heart_status: false, text_value: false };
        };
        //Sends message to pi with the status
        socket.emit("setstatus", { "heart_status": statuses[data.api_key].heart_status, "text_value": statuses[data.api_key].text_value });
        //Add new socket to the list for messaging later
        socket_list[data.api_key] = socket
    });

    //When user presses button on Pi it clears all statuses to turn off heart
    socket.on("turn_off_heart", (data) => {
        if (data.api_key in statuses) {
            statuses[data.api_key] = { heart_status: false, text_value: false };
        }
    })

    //What to do when a socket disconnects
    socket.on("disconnect", (socket) => {
        //Remove socket from the list
        delete socket_list[socket.id];
    });

});

