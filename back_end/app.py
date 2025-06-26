from fastapi import FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from nginxConf import getPortsinUse, configureSitesAvailable

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

if __name__ == '__main__':
    uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=True)