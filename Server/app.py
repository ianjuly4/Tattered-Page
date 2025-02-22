# app.py
from flask import Flask, render_template, request, make_response, session, send_from_directory, jsonify
from flask_restful import Api, Resource
from config import app, db, bcrypt, migrate, api, os, socketio
from models import User, BookShelf, Bookclub, Book, bookclub_users, Chatlog
from datetime import datetime


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

@socketio.on('connect')
def handle_connect():
    print("Client connected")

class BookclubUsers(Resource):
    def post(self):
        data = request.get_json()
        bookclub_id = data.get('bookclub_id')
        user_id_to_invite = data.get('user_id')  # ID of the user you want to invite

        # Check if the bookclub exists
        bookclub = Bookclub.query.get(bookclub_id)
        if not bookclub:
            return make_response({"error": "Bookclub not found"}, 404)

        # Check if the user exists
        user_to_invite = User.query.get(user_id_to_invite)
        if not user_to_invite:
            return make_response({"error": "User not found"}, 404)

        # Check if the user is already in the bookclub or has a pending invite
        existing_member = db.session.query(bookclub_users).filter_by(bookclub_id=bookclub_id, user_id=user_id_to_invite).first()
        if existing_member:
            if existing_member.status == 'accepted':
                return make_response({"error": "User is already a member of this bookclub"}, 400)
            elif existing_member.status == 'invited':
                return make_response({"error": "User already has a pending invite"}, 400)

        # Add the user to the bookclub_users table with the status "invited"
        new_invite = bookclub_users.insert().values(
            bookclub_id=bookclub_id,
            user_id=user_id_to_invite,
            status="invited",
            invited_at=datetime.utcnow()
        )
        db.session.execute(new_invite)
        db.session.commit()

        # Emit event for the invite (could be via socketio or other means)
        socketio.emit('new_invite', {
            'bookclub_id': bookclub_id,
            'user_id': user_id_to_invite
        }, room=user_id_to_invite)  # Send this to the invited user

        return make_response({"message": "Invite sent successfully"}), 201

api.add_resource(BookclubUsers, '/bookclub_users')


class Chatlogs(Resource):
    def get(self):
        chatlog_dict_list = [chatlog.to_dict() for chatlog in Chatlog.query.all()]
        if chatlog_dict_list:
            return chatlog_dict_list, 200
        else:
            return {"error": "No Chatlogs Found"}, 404
        
    def post(self):
        data = request.get_json()
        bookclub_id = data.get('bookclub_id')

        ##bookclub = Bookclub.query.filter(Bookclub.id == bookclub_id).first()
        
        ##if not bookclub:
            ##return make_response({"error": "Bookclub not found"}, 404)
        
        user_id = session.get('user_id')
        if not user_id:
            return make_response({"error": "Unauthorized, Please Login to Continue"}, 401)

        # Create a new chatlog
        new_chatlog = Chatlog(
            content="Chat started",  # Placeholder content
            bookclub_id=bookclub_id
        )
        db.session.add(new_chatlog)
        db.session.commit()


        # Emit event for new chatlog creation
        socketio.emit('new_chatlog_created', {'chatlog_id': new_chatlog.id}, room=bookclub_id)

        return make_response(new_chatlog.to_dict(), 201)
    
api.add_resource(Chatlogs, "/chatlogs")

class ChatlogsById(Resource):
    def patch(self):
        data = request.get_json()
        chatlog_id = data.get('chatlog_id')
        content = data.get('content')  # New content (message)
        user_ids_to_invite = data.get('user_ids')  # List of users to invite

        # Update content of the chatlog
        chatlog = Chatlog.query.get(chatlog_id)
        if chatlog:
            chatlog.content += f"\n{content}"  # Appending new content (message)
            db.session.commit()

        # Invite new users to the bookclub
        for user_id in user_ids_to_invite:
            # Add each user to the bookclub_users table
            new_member = bookclub_users.insert().values(
                bookclub_id=chatlog.bookclub_id,
                user_id=user_id,
                status="invited",
                invited_at=datetime.utcnow()
            )
            db.session.execute(new_member)
            db.session.commit()

        # Emit the updated chatlog (new message) to all connected users
        socketio.emit('chatlog_updated', {'chatlog_id': chatlog.id, 'content': chatlog.content}, room=chatlog.bookclub_id)

        return make_response({'message': 'Chatlog updated successfully', 'chatlog_id': chatlog.id}), 200

    def delete(self):
        data = request.get_json()
        user_id = data.get('user_id')
        bookclub_id = data.get('bookclub_id')

        # Remove the user from the bookclub_users table
        db.session.query(bookclub_users).filter_by(bookclub_id=bookclub_id, user_id=user_id).delete()
        db.session.commit()

        # Optionally, emit a 'user_left' event to notify other users
        socketio.emit('user_left', {'user_id': user_id}, room=bookclub_id)

        return make_response({'message': 'User left the chat successfully'}), 200
    
api.add_resource(ChatlogsById, "/chatlogs/<int:id>")

class Bookclubs(Resource):
    def get(self):
    
        bookclub_dict_list = [bookclub.to_dict() for bookclub in Bookclub.query.all()]
        if bookclub_dict_list:
            return bookclub_dict_list, 200
        else:
            return {"error": "No Bookclubs Found"}, 404
    
    def post(self):
        data = request.get_json()
        
        user_id = session.get('user_id')
        
        if not user_id:
            return make_response({"error": "Unauthorized, Please Login to Continue"}, 401)
        
        name = data.get('name')
        description = data.get('description')

        if not name or not description:
            return make_response({"error": "All bookclub fields are required"}, 400)

        new_bookclub = Bookclub(
            name=name,
            description=description
        )

        user = User.query.get(user_id)
        
        if not user:
            return make_response({"error": "User not found"}, 404)

        new_bookclub.users.append(user)

        db.session.add(new_bookclub)
        db.session.commit()

        return make_response(new_bookclub.to_dict(), 201)

api.add_resource(Bookclubs, "/bookclubs")

class BookclubsById(Resource):
    def delete(self, id):
        bookclub = Bookclub.query.filter(Bookclub.id == id).first()
        if not bookclub:
            return make_response({"error": "Bookclub not found"}, 404)
        
        db.session.delete(bookclub)
        db.session.commit()
        return make_response({"message": "Bookclub successfully deleted"}, 200)

api.add_resource(BookclubsById, '/bookclubs/<int:id>')

class Bookshelves(Resource):
    def get(self):
       
        bookshelves_dict_list = [bookshelf.to_dict() for bookshelf in BookShelf.query.all()]
        
        if bookshelves_dict_list:
            return bookshelves_dict_list, 200
        else:
            return {"message": "No Bookshelves Found"}, 404

    def post(self):
        data = request.get_json()

        user_id = session.get('user_id')
        if not user_id:
            return make_response({"message": "Unauthorized, Please Login to Continue"}, 401)

        name = data.get("name")
        description = data.get("description")
        genre = data.get("genre")

        if not name:
            return make_response({"message": "Bookshelf needs a name"}, 400)
        if not description:
            return make_response({"message": "Bookshelf needs a description"}, 400)
        if not genre:
            return make_response({"message": "Bookshelf needs a genre"}, 400)

        new_bookshelf = BookShelf(
            user_id=user_id,
            name=name,
            description=description,
            genre=genre
        )
      
        db.session.add(new_bookshelf)
        db.session.commit()

        
        return make_response(new_bookshelf.to_dict(), 201)
    

api.add_resource(Bookshelves, "/bookshelves")

class BookshelvesById(Resource):
    def get(self, id):
        shelf = BookShelf.query.filter(BookShelf.id == id).first()
        if shelf:
            return make_response(shelf.to_dict(), 200)
        return make_response({"message": "Bookshelf not found"}, 404)

    def patch(self, id):
        data = request.get_json()

        bookshelf = BookShelf.query.filter(BookShelf.id == id).first()

        book_id = data.get("book_id")
        book = Book.query.filter(Book.id == book_id).first()

        if not bookshelf or not book:
            return make_response({"error": "Bookshelf or Book not found."}, 404)

        if book in bookshelf.books:
            return make_response({"error": "This book is already in the bookshelf."}, 400)
        
        bookshelf.books.append(book)
        db.session.commit()

        return make_response(bookshelf.to_dict(), 200)

api.add_resource(BookshelvesById, "/bookshelves/<int:id>")

class BooksById(Resource):
    def delete(self, id):
        book = Book.query.filter(Book.id == id).first()
        if not book:
            return make_response({"error": "Book not found"}, 404)
        
        db.session.delete(book)
        db.session.commit()
        return make_response({"message": "Book successfully deleted"}, 200)
    
api.add_resource(BooksById, "/books/<int:id>")

class Books(Resource):
    def get(self):
        book_dict_list = [book.to_dict() for book in Book.query.all()]
        if book_dict_list:
            return book_dict_list, 200
        else:
            return {"message": "No Books Found"}, 404
        
    def post(self):
        data = request.get_json()

        user_id = session.get('user_id')
        print(user_id)
        if not user_id:
            return make_response({"error": "Unauthorized, Please Login to Continue"}, 401)

        title = data.get("title")
        author = data.get("author")
        synopsis = data.get("synopsis")
        cover_image = data.get("cover_image")
        progress = data.get("progress", 0)  
        published_date = data.get("published_date")
        google_key = data.get("google_key")
        
        ##print(title, author, synopsis, cover_image, progress, published_date, google_key)

        if not title or not author or not synopsis or not cover_image or not google_key:
            return make_response({"error": "All book fields are required."}, 400)
        
        new_book = Book(
            title=title,
            author=author,
            synopsis=synopsis,
            cover_image=cover_image,
            progress=progress,
            published_date=published_date,
            user_id=user_id,
            google_key=google_key
        )

        db.session.add(new_book)
        db.session.commit()

        return make_response(new_book.to_dict(), 201)

api.add_resource(Books, "/books")
       


class UsersById(Resource):
    def get(self, id):
        user = User.query.filter(User.id == id).first()
        return make_response(user.to_dict(rules=('-_password_hash',)), 200)
    
    def patch(self, id):
        data = request.get_json()
        user = User.query.filter(User.id == id).first()
        if not user:
            return make_response({"error": "User not found"}, 404)

        for attr, value in data.items():
            setattr(user, attr, value)

        db.session.commit()
        return make_response(user.to_dict(), 200)

    
    def delete(self, id):
        user = User.query.filter(User.id == id).first()
        if not user:
            return make_response({"message": "User not found"}, 404)
        
        db.session.delete(user)
        db.session.commit()
        return make_response({"message": "User successfully deleted"}, 200)
    
api.add_resource(UsersById, '/users/<int:id>') 


class Users(Resource):
    def get(self):
        user_dict_list = [user.to_dict() for user in User.query.all()]
        if user_dict_list:
            return user_dict_list, 200
        else:
            return {"error": "No Users Found"}, 404
    
    def post(self):
        data = request.get_json()
        
        if not data:
            return make_response({"message": "Invalid data. No data provided."}, 400)

        username = data.get('username')
        password = data.get('password')

        if not username and not password:
            return make_response({"error": "Username And Password Are Required."}, 422)

        user = User.query.filter(User.username == username).first()
        if user:
            return make_response({"error": "Username Already Taken."}, 422)

        new_user = User(username=username)
        new_user.password_hash = password  

        db.session.add(new_user)
        db.session.commit()

        session['user_id'] = new_user.id

        return make_response(new_user.to_dict(rules=('-_password_hash',)), 201)

    
api.add_resource(Users, '/users')



class CheckSession(Resource):
    def get(self):
        print(f"Session contents: {session}")
        user_id = session.get('user_id')
        if not user_id:
            return make_response({"message": "No user currently logged in"}, 401)

        user = User.query.filter(User.id == user_id).first()

        if user:
            return make_response(user.to_dict(rules=('-_password_hash',)), 200)
        else:
            return make_response({"message": "User not found"}, 404)
        
api.add_resource(CheckSession, "/check_session")


class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        print(f"Login attempt for username: {username}")

        user = User.query.filter(User.username == username).first()
        
        if not user:
            print(f"User not found: {username}")
            return make_response({'error': 'Username Not Found'}, 401)
        else:
            print(f"User found: {user.username}")

        if user.authenticate(password):
            session['user_id'] = user.id
            print("/login",session)
            return make_response({'message': 'Login successful', 'user': user.to_dict(rules=('-_password_hash',))}, 200)
        else:
            print(f"Password mismatch for user {username}")
    
api.add_resource(Login, '/login')   

class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return make_response({'message': 'Logged out successfully'}, 200)

api.add_resource(Logout, '/logout')



if __name__ == '__main__':
    socketio.run(app, port=5555, debug=True)


