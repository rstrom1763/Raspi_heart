const fs = require('fs');
const express = require('express');
const app = express();

const {Server} = require("socket.io")
const io = new Server(8765);

port = 8081;
app.use(express.json());
const nocache = require('nocache'); //Disable browser caching
//const { config } = require('process'); //Honestly not sure what this was used for if at all
app.use(nocache());
app.use(express.static('./'));
app.disable('etag', false); //Disable etag to help prevent http 304 issues
app.listen(port);
console.log('Listening on port ' + port + '... ');

//config = fs.readFileSync("./config.json", 'utf8');
//Read config file to memory into a json
const config = JSON.parse(JSON.stringify(fs.readFileSync("./config.json", 'utf8')))

app.get('/', (req, res) => {
    res.send(fs.readFileSync('./static/index.html', 'utf8'))
});

//For example only. Needs to be reworked for functionality
io.on("connection", (socket) => {
    console.log("Connection established! ")
    socket.on("howdy",(arg) => {
        console.log("it works!")
        console.log(arg)
    });
    socket.on("number_print",(arg) => {
        console.log(arg)
    })
})
