from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/addSubdomain', methods=['POST'])
def add_subdomain():
    subdomain = request.form.get('subdomain')
    port = request.form.get('port')   
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
    

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)