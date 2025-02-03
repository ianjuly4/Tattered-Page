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


if __name__ == '__main__':
    socketio.run(app, port=5555, debug=True) 
