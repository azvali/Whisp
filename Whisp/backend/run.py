from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os
from flask_cors import CORS
from app.models.login_model import db, users
from werkzeug.security import generate_password_hash

load_dotenv()

app = Flask(__name__)
CORS(app)


DB_USER = os.environ.get('DB_USER')
DB_PASSWORD = os.environ.get('DB_PASSWORD')
DB_HOST = os.environ.get('DB_HOST')
DB_NAME = os.environ.get('DB_NAME')

app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/api/signup', methods=['POST'])
def createUser():
    
    data = request.get_json()
    
    user = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    #hash the password
    hashed_password = generate_password_hash(password)
    
    new_user = users(username = user, email = email, password_hash = hashed_password)
    
    db.session.add(new_user)
    db.session.commit()
    
    
    return jsonify({"message": f'User {user} , {email}, {hashed_password} created'})



if __name__ == '__main__':
    app.run(debug=True)