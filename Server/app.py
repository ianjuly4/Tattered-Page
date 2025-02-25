from flask import Flask, render_template, request, make_response, session, send_from_directory, jsonify
from flask_restful import Api, Resource
from config import app, db, bcrypt, migrate, api, os, socketio, emit, join_room, send, leave_room, disconnect
from models import User, BookShelf, Bookclub, Book, bookclub_users, Chatlog
from datetime import datetime
import ipdb


@app.route('/')
@app.route('/<path:path>')
def index(path=None):
    return send_from_directory(os.path.join(app.static_folder), 'index.html')

user_sessions = {}  # Track user sessions by socket ID
room_users = {}  # Track users in each room

# Handle socket connection
@socketio.on('connect')
def handle_connect():
    user_id = session.get('user_id')  # Get user_id from session
    user_sessions[request.sid] = user_id
    print(f"User {user_id} connected with socket ID {request.sid}")

# Handle joining a room (bookclub)
@socketio.on('join_room')
def handle_join_room(data):
    bookclub_id = data.get('bookclub_id')
    username = data.get('username')

    if bookclub_id not in room_users:
        room_users[bookclub_id] = []

    room_users[bookclub_id].append(username) 
    join_room(bookclub_id)

    # Emit updated user list to all users in the room
    emit('room_users', {'bookclub_id': bookclub_id, 'users': room_users[bookclub_id]}, room=bookclub_id)

    print(f"User {username} joining room {bookclub_id}. Current users: {room_users[bookclub_id]}")

# Handle user disconnection
@socketio.on('disconnect')
def handle_disconnect():
    user_id = user_sessions.get(request.sid)
    if user_id:
        # Remove user from all rooms they're in
        for bookclub_id in room_users:
            if user_id in room_users[bookclub_id]:
                room_users[bookclub_id].remove(user_id)
                # Emit updated user list to everyone in the room
                emit('room_users', {'bookclub_id': bookclub_id, 'users': room_users[bookclub_id]}, room=bookclub_id)
        
        print(f"User {user_id} disconnected with socket ID {request.sid}")
        del user_sessions[request.sid]  # Clean up user session
    else:
        print(f"Socket ID {request.sid} disconnected without a valid user.")

# Handle receiving chat messages and broadcasting them to the room
@socketio.on("chat_message")
def handle_message(data):
    print("Received message:", data)
    emit("chat_message", data, room=data["bookclub_id"])


class UserInvites(Resource):
    def get(self, id):
      
        user_id = User.query.filter(User.id == id).first()

        if not user_id:
            return {"error": "User not found"}, 404
        
        invites = db.session.query(bookclub_users).filter_by(user_id = id).all()

        if not invites:
            return {"error": "No invites found"}, 404

        
        invites_list = []
        for invite in invites:

            bookclub = Bookclub.query.filter_by(id=invite.bookclub_id).first()
            if bookclub:
                invites_list.append({
                    'bookclub_id': invite.bookclub_id,
                    'bookclub_name': bookclub.name,
                    'status': invite.status,
                })


        response = make_response((invites_list)) 
        return response

# Define the route to access the user's invites
api.add_resource(UserInvites, "/users/<int:id>/invites")


class BookclubUsersById(Resource):

    def patch(self, id):
        data = request.get_json()

        bookclub_id = data.get('bookclub_id')
        response = data.get('response') 

        user_id = session.get("user_id")

        if not user_id or not bookclub_id or not response:
            return make_response({"error": "user_id, bookclub_id, and response are required"}), 400

        # Ensure user and bookclub exist
        user = User.query.get(user_id)
        bookclub = Bookclub.query.get(bookclub_id)

        if not user or not bookclub:
            return make_response({"error": "User or Bookclub not found"}), 404

        # Ensure the invite exists
        invite = db.session.query(bookclub_users).filter_by(user_id=user_id, bookclub_id=bookclub_id).first()

        if not invite:
            return make_response({"error": "Invite not found"}), 404

       
        invite.status = response  
        invite.responded_at = datetime.utcnow()

        db.session.commit()

        return make_response({"message": f"Invite {response} successfully"}), 200
    
api.add_resource(BookclubUsersById, '/bookclubs_users/<string:id>')


class BookclubsUsers(Resource):
    def post(self):
        data = request.get_json()

        user_id = data.get('user_id')
        bookclub_id = data.get('bookclub_id')

        if not user_id or not bookclub_id:
            return jsonify({"error": "user_id and bookclub_id are required"}), 400

        # Ensure user exists
        user = User.query.filter(User.id == user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Ensure bookclub exists
        bookclub = Bookclub.query.filter(Bookclub.id == bookclub_id).first()
        if not bookclub:
            return jsonify({"error": "Bookclub not found"}), 404

        # Check if the invite already exists (to avoid sending duplicate invites)
        existing_invite = db.session.query(bookclub_users).filter_by(user_id=user_id, bookclub_id=bookclub_id).first()

        if existing_invite:
            return jsonify({"error": "Invite already exists"}), 400

        # Insert invite into the 'bookclub_users' table
        new_invite = bookclub_users.insert().values(
            user_id=user_id,
            bookclub_id=bookclub_id,
            status='invited',
            invited_at=datetime.utcnow()
        )

        db.session.execute(new_invite)
        db.session.commit()

        #return jsonify({"message": "Invite sent successfully"}), 200

api.add_resource(BookclubsUsers, '/bookclubs_users')




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

        
        user_id = session.get('user_id')
        if not user_id:
            return make_response({"error": "Unauthorized, Please Login to Continue"}, 401)

     
        new_chatlog = Chatlog(
            content="Chat started", 
            bookclub_id=bookclub_id
        )
        db.session.add(new_chatlog)
        db.session.commit()

        
        socketio.emit('new_chatlog_created', {'chatlog_id': new_chatlog.id}, room=bookclub_id)

        return make_response(new_chatlog.to_dict(), 201)

    
api.add_resource(Chatlogs, "/chatlogs")

class ChatlogsById(Resource):
    def patch(self):
        data = request.get_json()
        chatlog_id = data.get('chatlog_id')
        content = data.get('content') 
        user_ids_to_invite = data.get('user_ids') 

        chatlog = Chatlog.query.get(chatlog_id)
        if chatlog:
            chatlog.content += f"\n{content}" 
            db.session.commit()

      
        for user_id in user_ids_to_invite:
            
            new_member = bookclub_users.insert().values(
                bookclub_id=chatlog.bookclub_id,
                user_id=user_id,
                status="invited",
                invited_at=datetime.utcnow()
            )
            db.session.execute(new_member)
            db.session.commit()

        
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

        
        db.session.add(new_bookclub) 
        db.session.commit() 

    
        bookclub_user = bookclub_users.insert().values(
            bookclub_id=new_bookclub.id,  
            user_id=user.id,
            status='creator',  
            invited_at=datetime.utcnow()
        )
        
       
        db.session.execute(bookclub_user)
        db.session.commit()

        return make_response(new_bookclub.to_dict(), 201)


api.add_resource(Bookclubs, "/bookclubs")

class BookclubsById(Resource):
    
    def patch(self, id):
        data = request.get_json()

        bookclub = Bookclub.query.filter(Bookclub.id == id).first()

        if not bookclub:
            return make_response({"error": "Bookclub not found."}, 404)

        book_id = data.get("book_id")
        book = Book.query.filter(Book.id == book_id).first()

        if not book:
            return make_response({"error": "Book not found."}, 404)

        action = data.get("action") 
        if action == "add":
            if book in bookclub.books:
                return make_response({"error": "This book is already in the bookclub."}, 400)
            bookclub.books.append(book)
            db.session.commit()
            return make_response(bookclub.to_dict(), 200)

        elif action == "remove":
            if book not in bookclub.books:
                return make_response({"error": "This book is not in the bookclub."}, 400)
            bookclub.books.remove(book)
            db.session.commit()
            return make_response(bookclub.to_dict(), 200)

        return make_response({"error": "Invalid action. Must be 'add' or 'remove'."}, 400)
    
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
        if not bookshelf:
            return make_response({"error": "Bookshelf not found."}, 404)

        book_id = data.get("book_id")
        book = Book.query.filter(Book.id == book_id).first()

        if not book:
            return make_response({"error": "Book not found."}, 404)

        action = data.get("action")  

        if action == "add":
            if book in bookshelf.books:
                return make_response({"error": "This book is already in the bookshelf."}, 400)
            bookshelf.books.append(book)
            db.session.commit()
            return make_response(bookshelf.to_dict(), 200)

        elif action == "remove":
            if book not in bookshelf.books:
                return make_response({"error": "This book is not in the bookshelf."}, 400)
            bookshelf.books.remove(book)
            db.session.commit()
            return make_response(bookshelf.to_dict(), 200)

        return make_response({"error": "Invalid action. Must be 'add' or 'remove'."}, 400)
    
    
    def delete(self, id):
        shelf = BookShelf.query.filter(BookShelf.id == id).first()
        if not shelf:
            return make_response({"error": "Bookshelf not found"}, 404)
        
        db.session.delete(shelf)
        db.session.commit()
        return make_response({"message": "Bookshelf successfully deleted"}, 200)

api.add_resource(BookshelvesById, "/bookshelves/<int:id>")

class BooksById(Resource):
    def get(self, id):
        book = Book.query.filter(Book.id == id).first()
        if not book:
            return make_response({"error":"Book not found"}, 404)
        return make_response(book.to_dict(rules=('-bookshelves.user','-user.bookshelves','-user.bookclubs','-books.user',)), 200)
    
    def delete(self, id):
        book = Book.query.filter(Book.id == id).first()
        if not book:
            return make_response({"message": "Book not found"}, 404)
        
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
        if not user_id:
            return make_response({"error": "Unauthorized, Please Login to Continue"}, 401)

        title = data.get("title")
        author = data.get("author")
        synopsis = data.get("synopsis")
        cover_image = data.get("cover_image")
        progress = data.get("progress", 0)
        published_date = data.get("published_date")
        google_key = data.get("google_key")

        if not title or not author or not synopsis or not cover_image or not google_key:
            return make_response({"error": "All book fields are required."}, 400)

       
        if published_date:
            try:
               
                formatted_date = datetime.strptime(published_date, "%Y-%d-%m").date()
            except ValueError:
                return make_response({"error": "Invalid date format for published_date. Please use YYYY-DD-MM format."}, 400)
        else:
            formatted_date = None

      
        new_book = Book(
            title=title,
            author=author,
            synopsis=synopsis,
            cover_image=cover_image,
            progress=progress,
            published_date=formatted_date,
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
        if user:
            return make_response(user.to_dict(rules=('-_password_hash', )), 200)
        return make_response({"error": "User not found"}, 404)

    
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
    def get(self, user_id=None):
        if user_id:
            user = User.query.get(user_id)
            if user:
               
                return make_response(user.to_dict(rules=(
                    '-_password_hash',
                    '-books.bookshelves', 
                    '-bookclubs.users',     
                    '-books.bookclubs',    
                )), 200)
            else:
                return {"error": "User not found"}, 404
        else:
           
            user_dict_list = [
                user.to_dict(rules=(
                    '-_password_hash',
                    '-books.bookshelves',  
                    '-bookclubs.users',     
                    '-books.bookclubs',     
                ))
                for user in User.query.all()
            ]
            
            if user_dict_list:
                return make_response(user_dict_list, 200)
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
        user_id = session.get("user_id")
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
            return make_response({'user': user.to_dict(rules=('-_password_hash',))}, 200)
        else:
            print(f"Password mismatch for user {username}")
            return make_response({'error': 'Incorrect password'}, 401)

api.add_resource(Login, "/login")

class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return make_response({'message': 'Logged out successfully'}, 200)

api.add_resource(Logout, '/logout')



if __name__ == '__main__':
    socketio.run(app, port=5555, debug=True)


