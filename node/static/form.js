
//Function to toggle the status of the heart and show the new status on the html page
function toggle() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === request.DONE) {
            if (request.status === 200) {
                document.getElementById('status').innerHTML = request.responseText
                if (request.responseText.includes("Heart ON")) {
                    element = document.getElementById('wrapper')
                    element.classList.add('wrapper')
                } else if (request.responseText.includes("Heart OFF")) {
                    element = document.getElementById('wrapper')
                    element.classList.remove('wrapper')
                }
            }
            if (request.status === 404) {
                document.getElementById('status').innerHTML = "ERROR"
            }
        }
    }
    try {
        request.open("GET", 'https://' + location.host + '/toggle/', true);
    } catch (error) {
        console.log(error)
        request.open("GET", 'https://' + location.host + '/toggle/', true);
    }

    try {
        request.send();
    } catch (error) {
        console.log(error)
    }
}

//Function to show status of the heart on the page
function set_initial_status() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === request.DONE) {
            if (request.status === 200) {

                document.getElementById('status').innerHTML = request.responseText
                //Create rainbow heart if heart is on
                //No rainbow heart if not
                if (request.responseText.includes("Heart ON")) {

                    element = document.getElementById('wrapper')
                    element.classList.add('wrapper')

                } else if (request.responseText.includes("Heart OFF")) {

                    element = document.getElementById('wrapper')
                    element.classList.remove('wrapper')

                }

            }
            else if (request.status === 404) {
                document.getElementById('status').innerHTML = "ERROR"
            }
            else {
                console.log("Some other error happened... ")
            }
        }
    }
    try {
        request.open("GET", 'https://' + location.host + '/getstatus', true);
        request.send();
        console.log("Got status over http")
    } catch (error) {
        request.open("GET", 'https://' + location.host + '/getstatus', true);
        request.send();
        console.log("Got status over https")
    }
}

//Sets the pi to show string message
function set_text() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === request.DONE) {
            if (request.status === 200) {

                //Set the status on the web page to show the current message
                document.getElementById('status').innerHTML = request.responseText

                //Ensure rainbow background is turned off
                element = document.getElementById('wrapper')
                element.classList.remove('wrapper')

            }
            else if (request.status === 404) {
                //Show the status as an error if get a 404
                document.getElementById('status').innerHTML = "ERROR"
            }
            else {
                //Log to the console that an unknown error happened
                console.log("Some other error happened... ")
            }
        }
    }
    try {

        //Try to send the text status over http by default
        request.open("POST", 'https://' + location.host + '/setmessage', true);
        request.setRequestHeader("content-type", "text/plain");
        request.setRequestHeader("text_value", document.getElementById("input").value)
        request.send();
        console.log("Sent message over http")

    } catch (error) {

        //If http fails try https. Eventually will use https only
        request.open("POST", 'https://' + location.host + '/setmessage', true);
        request.setRequestHeader("content-type", "text/plain");
        request.setRequestHeader("text_value", document.getElementById("input").value)
        request.send();
        console.log("Sent message over https")

    }
};

//When the page loads, trigger set_initial_status()
//This will show on the page what the status of the heart is at that moment
window.addEventListener('load', (event) => {
    set_initial_status();
});
