import os
import time
import threading
import re
import subprocess

def configureSitesAvailable(subdomain, port):
    current_dir = os.getcwd()
    while(current_dir != '/'):
        os.chdir("..")
        current_dir = os.getcwd()
    server_configuration_string = f"""
    server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name {subdomain};

    ssl_certificate /etc/letsencrypt/live/axonbuild.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/axonbuild.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://127.0.0.1:{port};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
server {
    listen 80;
    listen [::]:80;
    server_name {subdomain};

    return 301 https://$host$request_uri;
}"""
    with open("etc/nginx/sites-available/default", "a") as f:
        f.write(server_configuration_string)

def configureSitesEnabled(subdomain, port):
    current_dir = os.getcwd()
    while(current_dir != '/'):
        os.chdir("..")
        current_dir = os.getcwd()
    server_configuration_string = f"""
    server {{
        listen 80;
        listen [::]:80;
        server_name {subdomain};
        
        location / {{
            proxy_pass http://127.0.0.1:{port};
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }}
    }}"""
    with open("etc/nginx/sites-enabled/default", "a") as f:
        f.write(server_configuration_string)        


def getPortsinUse():
    current_dir = os.getcwd()
    while(current_dir != '/'):
        os.chdir("..")
        current_dir = os.getcwd()
    with open("etc/nginx/sites-enabled/default", "r") as f:
        file_content = f.readlines()        
    allnums = []
    for line in file_content:
        if('proxy_pass' in line):
            match = re.search(r':([^:;]+);', line)
            allnums.append(match.group(1))
            # numbers = re.findall(r'\d+', line)
            # numbers = [int(num) for num in numbers]
            # for num in numbers:
            #     allnums.append(num)
    allnums = list(set(allnums))
    return allnums
if __name__ == "__main__":
    getPortsinUse()
