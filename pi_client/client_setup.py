import json
from os import system

def sanitize(data):
    data_type = str(type(data))
    if data_type == '<class \'int\'>':
        return int(data)
    data = data.lower().replace('\n','')
    import string
    allowed_chars = list(string.ascii_lowercase)
    allowed_chars = list(string.ascii_uppercase)
    for char in string.digits: allowed_chars.append(char)
    for num in range(10): allowed_chars.append(num)
    for char in ['-','.',' ','/']: allowed_chars.append(char)

    new_string = ''
    for char in data:
        if char in allowed_chars:
            new_string += char
        else:
            new_string += ''
    return new_string


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
