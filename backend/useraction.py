from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash

#register function 
def register(mongo,bcrypt):
    data = request.get_json()
    username=data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not email or not password :
        return jsonify({"success": False, "message": "Missing required fields"}), 400
    existing_user = mongo.db.users.find_one({"email": email})
    if existing_user:
        return jsonify({"success": False, "message": "User already exists"}), 400
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user_data = {
        "username": username,
        "email": email,
        "password": hashed_password,
        "role": "user"  # Default role
    }
    mongo.db.users.insert_one(user_data)
    return jsonify({"success": True, "message": "User registered successfully"}), 201

#login function
def login(req,mongo,bcrypt):
    data = req.get_json()
    print("Received data:", data) 
    email = data['email']
    password = data['password']
    user = mongo.db.users.find_one({'email': email})
    if user and bcrypt.check_password_hash(user['password'], password):
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"message": "Invalid email or password"}), 401


