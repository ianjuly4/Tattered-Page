# app.py
from flask import Flask, render_template, request, make_response, session, send_from_directory
from flask_restful import Api, Resource
from config import app, db, bcrypt, migrate, api, os, socketio
from models import User, BookShelf, Bookclub, Book
from datetime import datetime


@app.route('/')
@app.route('/<path:path>')
def index(path=None):
    return send_from_directory(os.path.join(app.static_folder), 'index.html')
""""
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
"""


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
    def patch(self, id):
        data = request.get_json()

        bookshelf = BookShelf.query.filter(BookShelf.id == id).first()

        book_id = data.get("book_id")
        book = Book.query.filter(Book.id == book_id).first()

        if not bookshelf or not book:
            return make_response({"message": "Bookshelf or Book not found."}, 404)

        if book in bookshelf.books:
            return make_response({"message": "This book is already in the bookshelf."}, 400)
        
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
        if not user_id:
            return make_response({"message": "Unauthorized, Please Login to Continue"}, 401)

        title = data.get("title")
        author = data.get("author")
        synopsis = data.get("synopsis")
        cover_image = data.get("cover_image")
        progress = data.get("progress", 0)  
        published_date = data.get("published_date")


        if not title or not author or not synopsis or not cover_image:
            return make_response({"message": "All book fields are required."}, 400)
        
        new_book = Book(
            title=title,
            author=author,
            synopsis=synopsis,
            cover_image=cover_image,
            progress=progress,
            published_date=published_date,
            user_id=user_id,
        )

        db.session.add(new_book)
        db.session.commit()

        return make_response(new_book.to_dict(), 201)

api.add_resource(Books, "/books")


class Bookclub(Resource):
    def post(self):
        data = request.get_json()
        

        user_id = session.get('user_id')
        if not user_id:
            return make_response({"message": "Unauthorized, Please Login to Continue"}, 401)
        
        name=data.get('name'),
        description=data.get('description')

        if not name and not description:
            return make_response({"message": "All bookclub fields are required"}, 400)

        new_bookclub = Bookclub(
            name=name,
            description=description
        )

        db.session.add(new_bookclub)
        db.session.commit()

        return make_response(new_bookclub.to_dict(), 201)
    
api.add_resource(Bookclub, "/bookclub")


class Users(Resource):
    def get(self, id):
        
        
        user = User.query.filter(User.id == id).first()
        return make_response(user.to_dict(rules=('-_password_hash',)), 200)
    
api.add_resource(Users, '/users/<int:id>') 


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
                print("/login",session)
                return make_response({'message': 'Login successful', 'user': user.to_dict()}, 200)
            else:
                print(f"Password mismatch for user {username}")
        else:
            print(f"User not found: {username}")
        
        return make_response({'error': 'Invalid username or password'}, 401)
    
api.add_resource(Login, '/login')   

class Logout(Resource):
    def delete(self):
        print("/logout", session)
        session['user_id'] = None
        return make_response({'message': 'Logged out successfully'}, 200)

api.add_resource(Logout, '/logout')



if __name__ == '__main__':
    app.run(port=5555, debug=True) 
