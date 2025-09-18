from flask import Flask, jsonify, session, request, render_template, redirect, url_for, Response
from pymongo import MongoClient
import json
from bson import ObjectId
from openai import OpenAI
import certifi

client = MongoClient("mongodb+srv://dheerajkumargadhe25_db_user:MWObJ17I1yYGpjzI@cluster0.qhotxjv.mongodb.net/", tls=True, tlsCAFile=certifi.where())

chat_client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key="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", #<OPENROUTER_API_KEY>
)

db = client['sih']
ld = db['login_details']
content = db['content']
lsns = content['lesson']
profile = db['profiles']
quiz = db['quiz']
q1 = quiz['q1']
attempted_details = quiz['attempted_details']
global lang, user_db
user_db = None
lang = None

app = Flask(__name__)
app.secret_key = '123343'

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return super().default(o)

@app.route('/')
def home():
    return render_template('login.html', message=None)

@app.route('/login', methods=['POST'])
def login():
    email = request.form.get("email")
    password = request.form.get("password")
    l = request.form.get("lang")

    user = ld.find_one({"email":email, "password":password})

    if user:
        global lang, user_db
        user_db = profile['dheeraj']
        lang = l
        return redirect(url_for("dashboard"))
    else:
        return render_template("login.html", message="❌ Invalid email or password. Try again.")
    
@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html', lang=lang)

# Logout route
@app.route('/logout', methods=['GET', 'POST'])
def logout():
    session.clear()  # ✅ Clears all session data
    return redirect(url_for("home"))

@app.route('/profile_page')
def profile_page():
    return render_template('profile_page.html')

@app.route('/checkpoint')
def checkpoints():
    cp = request.args.get('cp')
    return render_template('checkpoints.html', cp=cp, lang=lang)

@app.route('/lsn')
def lsn():
    return render_template('lsn.html')

@app.route('/get_content', methods=['POST'])
def get_content():
    data = request.get_json()
    lsn, cp = data.get('lsn'), data.get('cp')

    lsn_conn = lsns[lsn]
    heading_doc = lsn_conn.find_one({'purpose': 'topics'})  # heading is a document

    cp_conn = lsn_conn[cp]
    cards = list(cp_conn.find())

    try:
        index = int(cp[-1]) - 1
        heading_text = heading_doc.get('topics', [])[index]  # assuming heading_doc['headings'] is a list
    except (ValueError, IndexError, TypeError):
        heading_text = "No heading found"

    return Response(
    JSONEncoder().encode({
        'cards': cards,
        'heading': heading_text
    }),
    mimetype='application/json'
)

@app.route('/get_profile', methods=['POST'])
def get_profile():
    if user_db==None:
        return jsonify({"error": "Invalid username or password"}), 401
    
    dt = request.get_json()
    res = user_db.find_one({'username':dt.get('username', '')})

    res['_id'] = str(res['_id'])
    return jsonify({'message':'ok', 'response':res})

@app.route('/quiz_page')
def quiz_page():
    return render_template('quiz_page.html')  # will create this file

@app.route('/get_quiz_questions')
def get_quiz_questions():
    questions = list(q1.find({}, {'_id': 0}))
    return jsonify(questions)

@app.route('/get_chat_reply', methods=['POST'])
def get_chat_reply():
    data = request.get_json()
    messages = [{"role": "user", 'content':'remember this is a chatbot purpose so give reply in raw format do not use any tables or like that. you can use '+
    'bullet points and etc...\n' + data.get('question')}]
    res = chat_client.chat.completions.create(
        extra_body={},
        model="openai/gpt-oss-20b:free",
        messages=messages
    )

    return jsonify({'reply':res.choices[0].message.content})

@app.route('/quiz_result/<username>')
def quiz_result(username):
    result = attempted_details.find_one({'username': username}, sort=[("attempted_on", -1)])

    if not result:
        return "No quiz result found for this user.", 404

    return render_template('quiz_result.html', result=result)



if __name__=='__main__':
    app.run(debug=True)
