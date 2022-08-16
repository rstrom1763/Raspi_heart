from cgitb import text
from email import message


def rainbow_hearts():
    import json
    import socketio
    import time
    from sense_hat import SenseHat
    import random


    config = open('./pi_client/client_config.json','r').read()
    config = json.loads(config)
    ws_url = ("ws://"+config["server"]+":"+config["ws_port"])
    global heart_status
    heart_status = True
    global text_status
    text_status = False
    global string_message
    string_message = ""

    #Prepare SenseHat object and set to use dim light on led
    sense = SenseHat()
    sense.low_light = True

    # Create variables to hold each RGB color we want to use

    # red
    r = (255, 0, 0)

    # pink
    p = (204, 0, 204)

    # orange
    o = (255, 128, 0)

    # yellow
    y = (255, 255, 0)

    # green
    g = (0, 255, 0)

    # aqua
    a = (0, 255, 255)

    # blue
    b = (0, 0, 255)

    # purple
    pr = (128, 0, 255)

    # empty (no color)
    e = (0, 0, 0)

    colors = [r,p,o,y,g,a,b,pr,e]

    red_heart = [
        e, e, e, e, e, e, e, e,
        e, r, r, e, r, r, e, e,
        r, r, r, r, r, r, r, e,
        r, r, r, r, r, r, r, e,
        r, r, r, r, r, r, r, e,
        e, r, r, r, r, r, e, e,
        e, e, r, r, r, e, e, e,
        e, e, e, r, e, e, e, e
    ]
    pink_heart = [
        e, e, e, e, e, e, e, e,
        e, p, p, e, p, p, e, e,
        p, p, p, p, p, p, p, e,
        p, p, p, p, p, p, p, e,
        p, p, p, p, p, p, p, e,
        e, p, p, p, p, p, e, e,
        e, e, p, p, p, e, e, e,
        e, e, e, p, e, e, e, e
    ]
    orange_heart = [
        e, e, e, e, e, e, e, e,
        e, o, o, e, o, o, e, e,
        o, o, o, o, o, o, o, e,
        o, o, o, o, o, o, o, e,
        o, o, o, o, o, o, o, e,
        e, o, o, o, o, o, e, e,
        e, e, o, o, o, e, e, e,
        e, e, e, o, e, e, e, e
    ]
    yellow_heart = [
        e, e, e, e, e, e, e, e,
        e, y, y, e, y, y, e, e,
        y, y, y, y, y, y, y, e,
        y, y, y, y, y, y, y, e,
        y, y, y, y, y, y, y, e,
        e, y, y, y, y, y, e, e,
        e, e, y, y, y, e, e, e,
        e, e, e, y, e, e, e, e
    ]
    green_heart = [
        e, e, e, e, e, e, e, e,
        e, g, g, e, g, g, e, e,
        g, g, g, g, g, g, g, e,
        g, g, g, g, g, g, g, e,
        g, g, g, g, g, g, g, e,
        e, g, g, g, g, g, e, e,
        e, e, g, g, g, e, e, e,
        e, e, e, g, e, e, e, e
    ]
    aqua_heart = [
        e, e, e, e, e, e, e, e,
        e, a, a, e, a, a, e, e,
        a, a, a, a, a, a, a, e,
        a, a, a, a, a, a, a, e,
        a, a, a, a, a, a, a, e,
        e, a, a, a, a, a, e, e,
        e, e, a, a, a, e, e, e,
        e, e, e, a, e, e, e, e
    ]
    blue_heart = [
        e, e, e, e, e, e, e, e,
        e, b, b, e, b, b, e, e,
        b, b, b, b, b, b, b, e,
        b, b, b, b, b, b, b, e,
        b, b, b, b, b, b, b, e,
        e, b, b, b, b, b, e, e,
        e, e, b, b, b, e, e, e,
        e, e, e, b, e, e, e, e
    ]
    purple_heart = [
        e, e, e, e, e, e, e, e,
        e, pr, pr, e, pr, pr, e, e,
        pr, pr, pr, pr, pr, pr, pr, e,
        pr, pr, pr, pr, pr, pr, pr, e,
        pr, pr, pr, pr, pr, pr, pr, e,
        e, pr, pr, pr, pr, pr, e, e,
        e, e, pr, pr, pr, e, e, e,
        e, e, e, pr, e, e, e, e
    ]

    heart_colors = [red_heart, pink_heart, orange_heart, blue_heart,
                    purple_heart, aqua_heart, green_heart, yellow_heart]

    #Create socketio client object
    sio = socketio.Client()

    #Define event listener(s) for socket

    #Set the heart status to the value given by the server
    @sio.on('setstatus')
    def on_message(data):
        global heart_status
        heart_status = data
        if (heart_status):
            sense.set_pixels(random.choice(heart_colors))
        if (not heart_status):
            sense.clear()
    @sio.on('set_text')
    def on_message(data):
        global heart_status
        heart_status = False
        global text_status
        text_status = True
        global string_message
        string_message = data

    #Connect to the websocket
    try:
        sio.connect(ws_url)
        print("Connected to " + ws_url)
        sio.emit('getstatus','')
    except:
        print("Could not connect to " + ws_url)
        exit()

    #Loop through the colors if the status is True
    while True:
        for color in heart_colors:
            if heart_status == True:
                color = random.choice(heart_colors)
                sense.set_pixels(color)
            if text_status == True:
                sense.show_message(string_message,text_colour=random.choice(colors),scroll_speed=.075)
            if heart_status == False and text_status == False:
                sense.clear()
            time.sleep(1)



rainbow_hearts()
