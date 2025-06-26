from flask import Flask, request, jsonify
from flask_cors import CORS
from nginxConf import configureNginx, getPortsinUse
app = Flask(__name__)
CORS(app)

@app.route('/addSubdomain', methods=['POST'])
def add_subdomain():
    subdomain = request.form.get('subdomain')
    port = request.form.get('port')   
    
@app.route('/getPortsinUse', methods=['GET'])
def get_ports():
    return getPortsinUse()
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)