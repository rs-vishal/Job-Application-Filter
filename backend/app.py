import os
import io
from flask import Flask, request, jsonify, session, send_file, abort
from werkzeug.security import check_password_hash, generate_password_hash
from flask_pymongo import PyMongo
import Text_extract as tex
from flask_cors import CORS
from werkzeug.utils import secure_filename
from pymongo.errors import PyMongoError
import gridfs
from bson.objectid import ObjectId


app = Flask(__name__)

app.config["MONGO_URI"] = "mongodb://localhost:27017/Job_Application"
app.config['SECRET_KEY'] = os.urandom(24)
mongo = PyMongo(app)
CORS(app, supports_credentials=True)
fs = gridfs.GridFS(mongo.db)

requirements = None

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
        last_document_cursor = mongo.db.requirements.find().sort('_id', -1).limit(1)
        last_document = list(last_document_cursor)  
        
        if last_document:
            global requirements
            requirements = last_document[0].get('requirements', [])            
            return jsonify({'requirements': requirements}), 200
        else:
            return jsonify({'message': 'No documents found'}), 404
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

@app.route('/admin/getFile/<email>', methods=['GET'])
def get_file(email):
    try:
        print(f"Fetching file for email: {email}")
        pipeline = [
            {"$match": {"metadata.email": email}}
        ]
        file_metadata = list(mongo.db.fs.files.aggregate(pipeline))

        if not file_metadata:
            return jsonify({"error": "File not found"}), 404

        file_id = file_metadata[0]['_id']
        file_id = str(file_id)

        def get_file_by_id(file_id):
            try:
                print(f"Fetching file with ID: {file_id}")
                file = fs.get(ObjectId(file_id))
                return send_file(
                    io.BytesIO(file.read()),
                    mimetype=file.content_type,
                    download_name=file.filename,
                    as_attachment=False
                )
            except Exception as e:
                print(f"Error fetching file with ID {file_id}: {e}")
                return jsonify({"error": "An error occurred", "message": str(e)}), 500

        return get_file_by_id(file_id)
    except Exception as e:
        print(f"Error fetching file for email {email}: {e}")
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

@app.route('/result/<email>', methods=['GET'])
def result(email):
    try:
        pipeline = [{"$match": {"metadata.email": email}}]
        file_metadata = list(mongo.db.fs.files.aggregate(pipeline))

        if not file_metadata:
            return jsonify({"error": "No file found for the given email"}), 404

        file_id = file_metadata[0]['_id']
        file = fs.get(ObjectId(file_id))
        file_content = file.read()

        if not file_content:
            return jsonify({"error": "File content is empty"}), 400

        last_document_cursor = mongo.db.requirements.find().sort('_id', -1).limit(1)
        last_document = list(last_document_cursor)
        requirements = last_document[0].get('requirements', [])

        if not requirements:
            return jsonify({"error": "No requirements set"}), 400

        temp_filename = secure_filename(file.filename)
        temp_dir = '/temp'
        if not os.path.exists(temp_dir):
            os.makedirs(temp_dir)
        temp_filepath = os.path.join(temp_dir, temp_filename)        
        try:
            with open(temp_filepath, 'wb') as temp_file:
                temp_file.write(file_content)

            result = tex.start(temp_filepath, requirements)
        finally:
            if os.path.exists(temp_filepath):
                os.remove(temp_filepath)
        return jsonify({'result': result})
    except Exception as e:
        return jsonify({"error": "An error occurred", "message": str(e)}), 500
    
@app.route('/admin/delete/<id>', methods=['DELETE'])
def delete(id):
    try:
        result = mongo.db.users.delete_one({"_id": ObjectId(id)})

        if result.deleted_count == 0:
            return jsonify({"error": "No document found with the provided ID"}), 404

        return jsonify({"message": "User successfully deleted"}), 200

    except Exception as e:
        return jsonify({"error": "An error occurred", "message": str(e)}), 500
 
if __name__ == '__main__':
    app.run(debug=True)
