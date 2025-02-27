from flask import Flask, render_template, request, make_response, session, send_from_directory, jsonify
from flask_restful import Api, Resource
from config import app, db, bcrypt, migrate, api, os
from models import User, BookShelf, Bookclub, Book
from datetime import datetime
import ipdb

@app.route('/')
@app.route('/<path:path>')
def index(path=None):
    return send_from_directory(os.path.join(app.static_folder), 'index.html')

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
        

        ACTIONS = {"add", "remove"}

        if action not in ACTIONS:
            return make_response({"error": "Invalid action. Must be 'add' or 'remove'."}, 400)

        if action == "add":
            if book in bookclub.books:
                return make_response({"error": "This book is already in the bookclub."}, 400)
            bookclub.books.append(book)
            db.session.commit()
            return make_response({"message": "Book added to bookclub.", "bookclub": bookclub.to_dict()}, 200)

        elif action == "remove":
            if book not in bookclub.books:
                return make_response({"error": "This book is not in the bookclub."}, 400)
            bookclub.books.remove(book)
            db.session.commit()
            return make_response({"message": "Book removed from bookclub.", "bookclub": bookclub.to_dict()}, 200)
    
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
        return make_response(book.to_dict(), 200)
    
    def patch(self, id):
        data = request.get_json()
        book = Book.query.filter(Book.id == id).first()
        if not book:
            return make_response({"message": "Book not found"}, 404)

        for attr, value in data.items():
            setattr(book, attr, value)

        db.session.commit()
        return make_response(book.to_dict(), 201)
    

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
            
                try:
                    parts = published_date.split("-")
                    if len(parts) == 3:
                        year, day, month = parts
                       
                        if int(day) > 12:
                            corrected_date = f"{year}-{day}-{month}"
                            formatted_date = datetime.strptime(corrected_date, "%Y-%d-%m").date()
                        else:
                            raise ValueError("Invalid date format")
                    else:
                        raise ValueError("Invalid date format")
                except Exception:
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
        return make_response(user.to_dict(rules=("-")), 200)

    
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
            return {"message": "No Users Found"}, 404
               
               
    
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
    app.run(port=5555, debug=True)


