import json
from os import system

config = open('./pi_client/client_config.json', 'w')

server = input('Server: ').strip()
port = input('Port: ').strip()
protocol = input('Protocol: ').strip()
userid = input('Userid: ').strip()

dict = {'server': server,
        'port': port,
        'protocol': protocol,
        'userid': userid}

jsonstr = json.dumps(dict)
config.write(jsonstr)

# Show the json config to user
system('clear')
print("Here is your config: \n\n" + jsonstr)
