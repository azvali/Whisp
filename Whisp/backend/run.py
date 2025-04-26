from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os
from flask_cors import CORS
from app.models.users_model import db, users
from werkzeug.security import generate_password_hash, check_password_hash
from sib_api_v3_sdk import SendSmtpEmail, SendSmtpEmailTo, ApiClient, TransactionalEmailsApi, Configuration

#loads the enviorment variables
load_dotenv()


#initialize the flask app and give cors support
app = Flask(__name__)
CORS(app)


#database connection details
DB_USER = os.environ.get('DB_USER')
DB_PASSWORD = os.environ.get('DB_PASSWORD')
DB_HOST = os.environ.get('DB_HOST')
DB_NAME = os.environ.get('DB_NAME')


#brevo api key
API_KEY = os.environ.get('API_KEY')


#set connection to database for app
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#connects sqlalchemy to flask app
db.init_app(app)


#endpoint to recieve sign up user data and stores it
@app.route('/api/signup', methods=['POST'])
def createUser():
    
    try:
        data = request.get_json()
        
        user = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        #hash the password
        hashed_password = generate_password_hash(password)
        
        new_user = users(username = user, email = email, password_hash = hashed_password)
        
        db.session.add(new_user)
        print(f"User added to session: {user}")
        db.session.commit()
        print(f"Session committed successfully")
        
        
        return jsonify({"message": f'User {user} , {email}, {hashed_password} created'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


#endpoint to validate user login data
@app.route('/api/login', methods=['POST'])
def checkLogin():
    
    try:
        data = request.get_json()
        
        username = data.get('username')
        password = data.get('password')
        
        
        pulledUser = users.query.filter(users.username == username).first()
        
        if pulledUser and check_password_hash(pulledUser.password_hash, password):
            
            return jsonify({'Message': 'Login Success',
                            'user': {
                            'id': pulledUser.id,
                            'username': pulledUser.username,
                            'email': pulledUser.email
                            }
                        }), 200
        
        return jsonify({'Message': 'Login Error',}), 401
        
    except Exception as e:
        return jsonify({'Message': str(e)}), 500


@app.route('/api/forgotpassword', methods=['POST'])
def forgotPassword():
    
    try:
        data = request.get_json()
        
        email = data.get('email')
        
        if not email:
            return jsonify({'Message' : 'Invalid Email'})
            
        #check if email is in the database
        db_email = users.query.filter(users.email == email).first()
        
        if not db_email:
            return jsonify({'Message' : 'nothing'})
        
        
        to = [SendSmtpEmailTo(email=email)]
        
        
        send_smtp_email = SendSmtpEmail(
        to=to,
        subject="Password Reset",
        html_content=f'Click <a href=\'http://localhost:5173/?token=123&email={email}\'>here</a> to reset your password.',
        sender={"name":"Whisp", "email":"yousefm2315@gmail.com"}
        )
        
        
        # Initialize the API client and TransactionalEmailsApi
        configuration = Configuration()
        configuration.api_key['api-key'] = API_KEY
        
        api_client = ApiClient(configuration) 
        smtp_api = TransactionalEmailsApi(api_client)
        api_response = smtp_api.send_transac_email(send_smtp_email)
        
        print(api_response)
        
        
        return jsonify({'Message' : 'hi'})
        
    except Exception as e:
        return jsonify({'Message' : str(e)}), 500
    

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)