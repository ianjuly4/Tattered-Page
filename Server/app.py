# app.py
from flask import Flask, render_template, request, make_response, session, send_from_directory
from flask_restful import Api, Resource
from models import User, BookShelf, Bookclub
from config import app, db, bcrypt, migrate, api, os, socketio


@app.route('/')
@app.route('/<path:path>')
def index(path=None):
    return send_from_directory(os.path.join(app.static_folder), 'index.html')

# Handle socket connection
@socketio.on('connect')
def handle_connect():
    print("A client has connected.")
    socketio.emit('response', {'data': 'Connected successfully!'})

# Handle receiving chat messages
@socketio.on('chat_message')
def handle_chat_message(data):
    print(f"Received message: {data}")
    socketio.emit('chat_message', {'message': f"Server received: {data['message']}"})


# Handle socket disconnection
@socketio.on('disconnect')
def handle_disconnect():
    print("Client disconnected")

#Handle sent message
@socketio.on('message')
def handle_message(message):
    print(f"Received message: {message}")
    socketio.emit('message', {'data': message})  # Emit the message with a custom event

class Bookclub(Resource):
    def post(self):
        data = request.get_json()
        print(data)

        user_id = session.get('user_id')
        if not user_id:
            return make_response({"message": "Unauthorized, Please Login to Continue"}, 401)

        new_bookclub = Bookclub(
            name=data.get('name'),
            description=data.get('description')
        )

        db.session.add(new_bookclub)
        db.session.commit()

        return make_response(new_bookclub.to_dict(), 201)
    
api.add_resource(Bookclub, "/bookclub")


class Users(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({"message": "Unauthorized, Please Login to Continue"}, 401)
        
        users = User.query.all()
        return make_response([user.to_dict() for user in users], 200)
    
api.add_resource(Users, '/users') 


class Signup(Resource):
    def post(self):
        data = request.get_json()
        if not data:
            return make_response({"message": "Invalid data. No data provided."}, 400)

        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return make_response({"message": "Username and password are required."}, 422)

      
        user = User.query.filter(User.username == username).first()
        if user:
            return make_response({"message": "Username already taken."}, 422)

      
        new_user = User(username=username)
        new_user.password_hash = password 

        db.session.add(new_user)
        db.session.commit()

        return make_response(new_user.to_dict(), 201)
api.add_resource(Signup, "/signup")

class CheckSession(Resource):
    def get(self):
        print(session)
        user = User.query.filter(User.id == session.get('user_id')).first()
        if user:
            return make_response(user.to_dict(rules=('-_password_hash',)), 200)
        return make_response({"message": "No user currently logged in"}, 401)

api.add_resource(CheckSession, '/check_session')


class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        print(f"Login attempt for username: {username}")

        user = User.query.filter(User.username == username).first()
        
        if user:
            print(f"User found: {user.username}")
            if user.authenticate(password):
                session['user_id'] = user.id
                return make_response({'message': 'Login successful', 'user': user.to_dict(rules=('-_password_hash',))}, 200)
            else:
                print(f"Password mismatch for user {username}")
        else:
            print(f"User not found: {username}")
        
        return make_response({'error': 'Invalid username or password'}, 401)
    
api.add_resource(Login, '/login')   

class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return make_response({'message': 'Logged out successfully'}, 200)

api.add_resource(Logout, '/logout')



if __name__ == '__main__':
    socketio.run(app, port=5555, debug=True) 
