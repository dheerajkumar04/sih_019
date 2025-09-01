from flask import Flask, request, render_template, redirect, jsonify
from pymongo import MongoClient
import json
from bson import ObjectId

client = MongoClient("mongodb://localhost:27017/")

db = client['sih']
ld = db['login_details']
content = db['content']
lsns = content['lesson']

app = Flask(__name__)

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return super().default(o)

@app.route('/')
def home():
    return render_template('student.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()  # Get JSON body
    username = data.get('username')
    password = data.get('password')

    d = ld.find_one({'user':username, 'password':password})
    if d:
        #connect to collection of corresponding user
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401
    
@app.route('/dashboard')
def dashboard():
    return render_template('student.html')

@app.route('/get_content', methods=['POST'])  # <- This line is critical
def get_content():
    data = request.get_json()
    lsn, cp = data.get('lsn'), data.get('cp')

    lsn_conn = lsns[lsn]
    cp_conn = lsn_conn[cp]

    cards = list(cp_conn.find())

    return JSONEncoder().encode(cards)


if __name__=='__main__':
    app.run(debug = True)
