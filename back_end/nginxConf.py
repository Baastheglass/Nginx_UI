import os
import time
import threading

def configureNginx():
    pass

def configureSitesAvailable(subdomain, port):
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
        }}
    """
    with open("etc/nginx/sites-available/default", "a") as f:
        f.write("This is my appended string.\n")
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
        }}
    """
    with open("etc/nginx/sites-enabled/default", "a") as f:
        f.write("This is my appended string.\n")        

if __name__ == "__main__":
    configureSitesEnabled("a", "b")