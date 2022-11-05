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


def generate_api_key(length):
    import string
    from random import SystemRandom
    return ''.join(SystemRandom().choice(string.ascii_uppercase + string.digits + string.ascii_lowercase) for _ in range(length))


config = open('./client_config.json', 'w')


api_key = generate_api_key(15)
server = input('Server: ').strip()


dict = {'api_key': api_key,
        'server': server,
        'port': 8081,
        'protocol': 'https',
        'ws_port': '8765'
}
jsonstr = json.dumps(dict)
config.write(jsonstr)

# Commands to install the service
commands = ['pip3 install -r requirements.txt',
            'systemctl stop heart_client',
            'rm /etc/systemd/system/heart_client.service',
            'cp ./heart_client.service /etc/systemd/system/',
            'cp -r ../../Raspi_heart /etc/',
            'systemctl daemon-reload',
            'systemctl start heart_client.service',
            'systemctl enable heart_client.service']

# Execute the commands
for command in commands:
    try:
        system(command)
    except:
        print("Could not execute '" + command + "'")

# Show the json config to user
system('clear')
print("Here is your config: \n\n" + jsonstr)
print("Share your api key in order for others to use your pi!")
