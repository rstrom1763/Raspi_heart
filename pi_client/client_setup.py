import json

config = open('./pi_client/client_config.json', 'w')

server = input('Server: ')
port = input('Port: ')
protocol = input('Protocol: ')
userid = input('Userid: ')

dict = {'server': server,
        'port': port,
        'protocol': protocol,
        'userid': userid}

jsonstr = json.dumps(dict)
config.write(jsonstr)
print(jsonstr)
