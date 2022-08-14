function toggle() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === request.DONE) {
            if (request.status === 200) {
                document.getElementById('status').innerHTML = request.responseText
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