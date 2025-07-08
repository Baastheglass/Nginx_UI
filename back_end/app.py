from fastapi import FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from nginxConf import getPortsinUse, configureSitesAvailable
import yaml
import os

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.post("/addSubdomain")
async def add_subdomain(subdomain: str = Form(...), port: str = Form(...)):
    try:
        print(f"Received subdomain: {subdomain}")
        print(f"Received port: {port}")
        used_ports = getPortsinUse()
        print("Used ports: ", used_ports)
        if(int(port) in used_ports):
            return {
                "success": False,
                "message": f"Port {port} is already in use. Please choose a different port."
            }
        else:
            configureSitesAvailable(subdomain, port)        
            return {
                "success": True,
                "message": "Configuration created successfully"
            }
            
        
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/getPortsinUse")
async def get_ports():
    try:
        used_ports = getPortsinUse()#[69, 420]
        
        # Convert numbers to objects with port property
        formatted_ports = [{"port": port} for port in used_ports]
    # Return in the format your frontend expects
        return {
            "success": True,
            "data": formatted_ports
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/authenticate")
async def authenticate(username: str = Form(...), password: str = Form(...)):
    if(os.getcwd() == '/'):
        os.chdir('root/Nginx_UI/back_end')
    try:
        with open("credentials.yaml", "r") as f:
            credentials = yaml.safe_load(f)
        print(username)
        print(credentials['username'])
        print(password)
        print(credentials['password'])
        
        if(username in credentials['username'] and password in credentials['password'] and list(credentials['username']).index(username) == list(credentials['password']).index(password)):
            return {"success": True}
        else:
            return {"success": False}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str((e, os.listdir("."))))
    
if __name__ == '__main__':
    uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=True)
    # with open("credentials.yaml", "r") as f:
    #     credentials = yaml.safe_load(f)
    # print(credentials['username'])
