
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
        request.open("GET", 'http://' + location.host + '/toggle/', true);
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
        request.open("GET", 'http://' + location.host + '/getstatus', true);
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
                document.getElementById('status').innerHTML = request.responseText
                element = document.getElementById('wrapper')
                element.classList.remove('wrapper')
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
        request.open("POST", 'http://' + location.host + '/setmessage', true);
        request.setRequestHeader("content-type", "text/plain");
        request.setRequestHeader("text_value", document.getElementById("input").value)
        request.send();
        console.log("Sent message over http")
    } catch (error) {
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
