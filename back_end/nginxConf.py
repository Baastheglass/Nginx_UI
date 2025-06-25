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
    with open("etc/nginx/sites-available/default", "a") as f:
        f.write("This is my appended string.\n")
def configureSitesEnabled(subdomain, port):
    current_dir = os.getcwd()
    while(current_dir != '/'):
        os.chdir("..")
        current_dir = os.getcwd()
    with open("etc/nginx/sites-enabled/default", "a") as f:
        f.write("This is my appended string.\n")        

if __name__ == "__main__":
    configureSitesEnabled("a", "b")