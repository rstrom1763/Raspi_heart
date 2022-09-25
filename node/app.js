const fs = require('fs');
const express = require('express');
const app = express();
const { urlencoded } = require('body-parser');
const mongoose = require('mongoose');
const process = require('process')
const dotenv = require('dotenv')
dotenv.config();

//Create the socketio server and define listening port
const { Server } = require("socket.io");
const io = new Server(process.env.SOCKET_PORT);

//Connect to mongodb
mongoose.connect('mongodb://' + process.env.MONGO_HOST + '/userdata?retryWrites=true&w=majority', { user: process.env.MONGO_USERNAME, pass: process.env.MONGO_ROOT_PASSWORD, useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log("Connected to MongoDB! ")
});
//Create mongoose user schema
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone_number: { type: String, required: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema, 'users');

app.use(express.json());
app.use(urlencoded({ extended: false }));
const nocache = require('nocache'); //Disable browser caching
app.use(nocache());
app.use(express.static('./'));
app.disable('etag', false); //Disable etag to help prevent http 304 issues

if (process.env.PROTOCOL == "https") {
    https.createServer({
        key: fs.readFileSync('privkey.pem'),
        cert: fs.readFileSync('cert.pem'),
        ca: fs.readFileSync('chain.pem'),
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


heart_status = false;
text_value = false;

//Send the html page for the web gui
app.get('/', (req, res) => {
    res.send(fs.readFileSync('./static/index.html', 'utf8'));
});

//Sends the current status of the pi
app.get('/getstatus', (req, res) => {
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
    heart_status = !heart_status;
    if (heart_status) {
        res.send("Status: Heart ON ");
    }
    if (heart_status === false) {
        res.send("Status: Heart OFF ");
    }

    //Text will always be false since this toggles the heart
    text_value = false

    //Send the new status to the Pi so it can act on the new status
    io.sockets.emit('setstatus', { "heart_status": heart_status, "text_value": text_value });
});

//Route to turn the pi message or heart off
app.post('/off', (req, res) => {
    heart_status = false;
    text_value = false;
    io.sockets.emit('setstatus', { "heart_status": heart_status, "text_value": text_value });
    res.send('Success')
});

//Sets that value of the message to be shown
app.post('/setmessage', (req, res) => {
    text_value = req.headers.text_value
    heart_status = false

    //Send new message to the pi through the websocket connection
    io.sockets.emit('setstatus', { "heart_status": heart_status, "text_value": text_value });

    //Write message to log file
    fs.appendFile('./messages.log', req.headers.text_value + '\n', (err) => {
        if (err) { err };
    });

    //Send the gui the status message to display
    res.send("Showing message: \"" + text_value + "\"")
});

app.get('/getUser/:username', (req, res) => {
    const username = req.params.username.toLowerCase()
    User.findOne({ "username": username }, (err, data) => {
        if (err) { err } else if (data != null) {
            res.send(data)
        } else if (data == null) {
            res.send("Could not find user")
        }
    });
});

//Web socket responses are defined in here
io.on("connection", (socket) => {

    //Sends the status of the heart and message
    socket.on("getstatus", () => {
        socket.emit("setstatus", { "heart_status": heart_status, "text_value": text_value });
    });

});

/*
//This is an example for adding a user to the database
User.create(
    {
        username: "johndoe1812",
        name: "John",
        email: "johndoe1812@yahoo.com",
        phone_number: "912-578-5690",
        password: "password"
    }
)

//This is an example of querying the data from MongoDB
//Getting the query results has to be in the callback
User.findOne({ "username": "johndoe1812" }, (err, data) => {
    if (err) { err }
    console.log(data.email);
});
*/
