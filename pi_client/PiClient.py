def rainbow_hearts():
    import json
    from os import system
    import socketio
    import time
    import requests

    config = open('./pi_client/client_config.json','r').read()
    config = json.loads(config)
    url = ("ws://"+config["server"]+":"+config["port"])
    from sense_hat import SenseHat

    #Connect to websocket
    sio = socketio.Client()
    sio.connect(url)
    #,'{"query":{"id":config["userid"]}}'
    id_json = {"id":config['userid']}
    id_json = json.dumps(id_json)
    sio.emit("id",id_json)

    #Send info for 
    sio.emit('id',config['userid'])

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
    i = True
    sense.clear()
    count = 1
    while i:
        for color in heart_colors:
            try:
                if requests.get(url).content == "1":
                    sense.set_pixels(color)
                else:
                    sense.clear()
                time.sleep(5)
            except:
                print("Could not connect")
                time.sleep(1)


import socketio
import time

sio = socketio.Client()
sio.connect('http://10.0.0.178:8765')
print("connected! Mwahahaha!")

for num in range(5001):
    sio.emit("number_print",(num))

rainbow_hearts()
