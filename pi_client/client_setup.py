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
    for char in ['-','.',' ','/',':']: allowed_chars.append(char)

    new_string = ''
    for char in data:
        if char in allowed_chars:
            new_string += char
        else:
            new_string += ''
    return new_string

# Function to generate an API key to use with the server
def generate_api_key(length):
    import string
    from random import SystemRandom
    return ''.join(SystemRandom().choice(string.ascii_uppercase + string.digits + string.ascii_lowercase) for _ in range(length))

# Read the existing config
# If it fails, generate API key
try:
    config = open('./client_config.json','r').read()
    config = json.loads(config)
except:
    api_key = generate_api_key(15)

# If API key is blank, generate one 
# If not, use the existing key
if 'api_key' in config:
    api_key = config['api_key']
else:
    api_key = generate_api_key(15)

# Ask for the server to connect the websocket to
# Use previously existing server if possible
if 'server' in config:
    server = config['server']
else:
    server = sanitize(input('Server: ')).strip()

#Build the config as a dict to be later turned into JSON
dict = {'api_key': api_key,
        'server': server,
        'port': 8081,
        'protocol': 'https',
        'ws_port': '8765'
}

# Output the config as a JSON and write to disk
jsonstr = json.dumps(dict)
with open('./client_config.json', 'w') as f:
    f.write(jsonstr)


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
