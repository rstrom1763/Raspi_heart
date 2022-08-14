function toggle() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === request.DONE) {
            if (request.status === 200) {

            }
            if (request.status === 404) {

            }
        }
    }
    try {
        request.open("GET", 'http://' + location.host + '/getcomputer/' + data, true);
    } catch (error) {
        console.log(error)
        request.open("GET", 'https://' + location.host + '/getcomputer/' + data, true);
    }

    try {
        request.send(data.toLowerCase());
    } catch (error) {
        console.log(error)
    }
}