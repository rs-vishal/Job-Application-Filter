from flask import Flask, request, jsonify, session, send_file
from werkzeug.security import check_password_hash, generate_password_hash
from flask_pymongo import PyMongo
import io
import os
from flask_cors import CORS
from werkzeug.utils import secure_filename
import gridfs
from bson import ObjectId

app = Flask(__name__)

# Load environment variables
app.config["MONGO_URI"] = "mongodb://localhost:27017/Job_Application"
app.config['SECRET_KEY'] = os.urandom(24)

mongo = PyMongo(app)
CORS(app, supports_credentials=True)
fs = gridfs.GridFS(mongo.db)

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = "user"
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
            "role": role
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
            session['user'] = {
                'username': user['username'],
                'role': user.get('role', 'user'),
                'user_id': str(user['_id'])  
            }
            return jsonify({
                'username': user['username'],
                'email': user['email'],
                'role': user['role'],
                'id': str(user['_id'])
            })
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
    except Exception as e:
        print("Error logging in user:", str(e))
        return jsonify({"success": False, "message": "An error occurred while logging in"}), 500

@app.route('/admin/requirements', methods=['POST'])
def set_requirements():
    try:
        data = request.get_json()
        result = mongo.db.requirements.insert_one(data)
        response_data = {
            "message": "Requirements added",
            "id": str(result.inserted_id)
        }
        return jsonify(response_data), 201
    except Exception as e:
        print(e)
        return jsonify({"error": "An error occurred", "message": str(e)}), 500

@app.route('/admin/getrequirements', methods=['GET'])
def get_requirements():
    try:
        requirements = mongo.db.requirements.find({}, {"_id": 0, "requirement": 0})
        requirements_list = list(requirements)
        return jsonify(requirements_list), 200
    except Exception as e:
        return jsonify({"error": "An error occurred", "message": str(e)}), 500

@app.route('/upload', methods=['POST'])
def upload_resume():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    email = request.form.get('email')

    print("Received file:", file)
    print("Email:", email)

    if file.filename.strip() == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        filename = secure_filename(file.filename)
        metadata = {'email': email}
        file_id = fs.put(file, filename=filename, metadata=metadata)
        return jsonify({"message": "File uploaded successfully", "file_id": str(file_id)}), 201
    except Exception as e:
        print(e)
        return jsonify({'error': 'An error occurred while uploading the file'}), 500



@app.route('/admin/getFiles', methods=['GET'])
def get_files():
    try:
        files = mongo.db.fs.files.find()
        file_list = []
        for file in files:
            file_list.append({
                "filename": file['filename'],
                "file_id": str(file['_id'])
            })
        print(file_list)
        return jsonify(file_list)
    except Exception as e:
        print(e)
        return jsonify({"error": "An error occurred", "message": str(e)}), 500

@app.route('/users', methods=['GET'])
def get_users():
    try:
        users = mongo.db.users.find()
        users_list = []
        for user in users:
            user['_id'] = str(user['_id'])
            users_list.append(user)
        return jsonify(users_list), 200
    except Exception as e:
        return jsonify({'message': 'Error fetching users', 'error': str(e)}), 500

@app.route('/admin/getFile/<file_id>', methods=['GET'])
def get_file(file_id):
    try:
        print(f"Fetching file with ID: {file_id}")  # Debug print
        file = fs.get(ObjectId(file_id))
        return send_file(io.BytesIO(file.read()), mimetype=file.content_type, download_name=file.filename, as_attachment=False)
    except Exception as e:
        print(e)
        return jsonify({"error": "An error occurred", "message": str(e)}), 500

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify({'message': 'Logged out successfully'}), 200

@app.route('/session', methods=['GET'])
def get_session():
    if 'user' in session:
        user = mongo.db.users.find_one({'username': session['user']['username']})
        return jsonify({
            'id': str(user['_id']),
            'username': user['username'],
            'email': user.get('email', ''),
            'role': user.get('role', 'user')
        })
    return jsonify({'message': 'Not logged in', 'status': 'fail'}), 401

if __name__ == '__main__':
    app.run(debug=True)
