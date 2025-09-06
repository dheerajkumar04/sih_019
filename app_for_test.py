from flask import Flask, request, render_template, redirect, jsonify
from pymongo import MongoClient
import json
from bson import ObjectId

client = MongoClient(your_mongodb_connect)

db = client['sih']
ld = db['login_details']
content = db['content']
lsns = content['lesson']
profile = db['profiles']
global user_db
user_db = None

app = Flask(__name__)

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return super().default(o)

@app.route('/')
def home():
    return render_template('student_for_lsn_test.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()  # Get JSON body
    username = data.get('username')
    password = data.get('password')

    d = ld.find_one({'user':username, 'password':password})
    if d:
        #connect to collection of corresponding user
        global user_db
        user_db = profile[username]
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401
    
@app.route('/dashboard')
def dashboard():
    return render_template('student.html')

@app.route('/profile_page')
def profile_page():
    return render_template('profile_page.html')

@app.route('/checkpoint')
def checkpoint():
    cp = request.args.get('cp')
    return render_template('checkpoint.html')

@app.route('/lsn')
def lsn():
    return render_template('lsn.html')

@app.route('/get_content', methods=['POST'])  # <- This line is critical
def get_content():
    data = request.get_json()
    lsn, cp = data.get('lsn'), data.get('cp')

    lsn_conn = lsns[lsn]
    cp_conn = lsn_conn[cp]

    cards = list(cp_conn.find())
    
    return JSONEncoder().encode(cards)

@app.route('/get_profile', methods=['POST'])
def get_profile():
    if user_db==None:
        return jsonify({"error": "Invalid username or password"}), 401
    
    dt = request.get_json()
    res = user_db.find_one({'username':dt.get('username', '')})

    res['_id'] = str(res['_id'])
    return jsonify({'message':'ok', 'response':res})

@app.route('/get_achievements', methods=['POST'])
def get_achievements():
    if user_db==None:
        return jsonify({"error":"Invalid Request"}), 401
    
    Achievements = user_db['Achievements']
    res = list(Achievements.find())

    return JSONEncoder().encode(res)

@app.route('/get_badges')
def get_badges():
    if user_db==None:
        return jsonify({"error":"Invalid Request"}), 401
    
    Badges = user_db['Badges']
    res = list(Badges.find())

    return JSONEncoder().encode(res)

@app.route('/get_progress')
def get_progress():
    if user_db==None:
        return jsonify({"error":"Invalid Request"}), 401
    
    Progress = user_db['Progress']
    res = list(Progress.find())

    return JSONEncoder().encode(res)

@app.route('/get_points')
def get_points():
    if user_db==None:
        return jsonify({"error":"Invalid Request"}), 401
    
    Points = user_db['Points']
    res = list(Points.find())

    return JSONEncoder().encode(res)

if __name__=='__main__':
    app.run(debug = True)
