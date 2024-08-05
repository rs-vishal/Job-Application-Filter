from flask import Flask, request, jsonify, session
from werkzeug.security import check_password_hash, generate_password_hash
from flask_pymongo import PyMongo
import os
from flask_cors import CORS
from bson import ObjectId

app = Flask(__name__)

# Load environment variables
app.config["MONGO_URI"] = "mongodb://localhost:27017/Job_Application"
app.config['SECRET_KEY'] = os.urandom(24)

mongo = PyMongo(app)
CORS(app)

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"success": False, "message": "Email and password are required"}), 400

    existing_user = mongo.db.users.find_one({"email": email})
    if existing_user:
        return jsonify({"success": False, "message": "User with this email already exists"}), 400
    
    try:
        hashed_password = generate_password_hash(password)
        user_data = {
            "username": username,
            "email": email,
            "password": hashed_password,
            "role": "user"
        }
        mongo.db.users.insert_one(user_data)
        return jsonify({"success": True, "message": "User registered successfully"}), 201
    except Exception as e:
        print("Error inserting user:", str(e))
        return jsonify({"success": False, "message": "An error occurred while registering the user"}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    print("Logging in user:", email)
    try:
        user = mongo.db.users.find_one({"email": email})
        if user and check_password_hash(user['password'], password):
            session['user_id'] = str(user['_id'])
            session['role'] = user['role']
            return jsonify({'message': 'Logged in successfully', 'role': user['role']}), 200

        return jsonify({'message': 'Invalid credentials'}), 401
    except Exception as e:
        print("Error logging in user:", str(e))
        return jsonify({"success": False, "message": "An error occurred while logging in"}), 500

# @app.route('/logout', methods=['POST'])
# def logout():
#     session.clear()
#     return jsonify({'message': 'Logged out successfully'}), 200

# @app.route('/admin', methods=['GET'])
# def admin_route():
#     if 'role' not in session or session['role'] != 'admin':
#         return jsonify({'message': 'Cannot perform that function!'}), 403
#     return jsonify({'message': 'Welcome, Admin!'})

# @app.route('/api/user', methods=['GET'])
# def user_route():
#     if 'role' not in session or session['role'] not in ['user', 'admin']:
#         return jsonify({'message': 'Cannot perform that function!'}), 403
#     return jsonify({'message': 'Welcome, User!'})

@app.route('/users', methods=['GET'])
def get_users():
    data=request.get_json()
    role=data.get('role')
    if role=='admin':
        try:
            users = mongo.db.users.find()
            users_list = []
            for user in users:
                user['_id'] = str(user['_id'])
                users_list.append(user)
            return jsonify(users_list), 200
        except Exception as e:
            return jsonify({'message': 'Error fetching users', 'error': str(e)}), 500
    else:
        return jsonify({'msg':'you are not allowed to see the file'}),403    

if __name__ == '__main__':
    app.run(debug=True)
