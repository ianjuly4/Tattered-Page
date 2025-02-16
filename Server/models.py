from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from config import db, bcrypt, association_proxy
from datetime import datetime

class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    serialize_rules = ("-bookshelves.user", "-bookclubs.users")  

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    _password_hash = db.Column(db.String, nullable=False)
    avatar = db.Column(db.String, nullable=True)
    accolade = db.Column(db.String, nullable=True)
    goal = db.Column(db.String, nullable=True)
    streak = db.Column(db.String, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    bookshelves = db.relationship('BookShelf', back_populates='user', cascade='all, delete-orphan')
    bookclubs = db.relationship('Bookclub', secondary='bookclub_users', back_populates='users')

    @hybrid_property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

# One to Many
class BookShelf(db.Model, SerializerMixin):
    __tablename__ = "bookshelves"

    serialize_rules = ('-user.bookshelves',) 

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=True)
    genre = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime, onupdate=datetime, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('User', back_populates='bookshelves')
    books = db.relationship('Book', secondary='bookshelf_books', back_populates='bookshelves')


# Bookshelf-Book (many-to-many relationship between bookshelf and book through the 'bookshelf_books' table)
bookshelf_books = db.Table('bookshelf_books',
    db.Column('bookshelf_id', db.Integer, db.ForeignKey('bookshelves.id'), primary_key=True),
    db.Column('book_id', db.Integer, db.ForeignKey('books.id'), primary_key=True)
)

class Book(db.Model, SerializerMixin):
    __tablename__ = "books"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    author = db.Column(db.String, nullable=False)
    synopsis = db.Column(db.String, nullable=False)
    category = db.Column(db.String, nullable=False)
    release_date = db.Column(db.Date, nullable=True)
    spine_image = db.Column(db.String, nullable=True)
    cover_image = db.Column(db.String, nullable=False)
    progress = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime, nullable=False)
    last_read_at = db.Column(db.DateTime, nullable=True)

    bookshelves = db.relationship('BookShelf', secondary='bookshelf_books', back_populates="books")
    bookclubs = db.relationship('Bookclub', secondary='bookclub_books', back_populates='books')

    def set_release_date(self, release_date_str):
        # Convert the date string to a datetime.date object
        if release_date_str:
            try:
                self.release_date = datetime.strptime(release_date_str, "%Y-%m-%d").date()
            except ValueError:
                raise ValueError("Invalid date format. Use YYYY-MM-DD.")

# BookClub-Book (many-to-many relationship between book and bookclub through the 'bookclub_books' table)
bookclub_books = db.Table('bookclub_books',
    db.Column('bookclub_id', db.Integer, db.ForeignKey('bookclubs.id'), primary_key=True),
    db.Column('book_id', db.Integer, db.ForeignKey('books.id'), primary_key=True)
)

class Bookclub(db.Model, SerializerMixin):
    __tablename__= "bookclubs"

    serialize_rules = ("-chatlogs.bookclub", "-users.bookclubs")  

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime, onupdate=datetime, nullable=False)

    books = db.relationship('Book', secondary='bookclub_books', back_populates='bookclubs')
    users = db.relationship('User', secondary='bookclub_users', back_populates='bookclubs')
    chatlogs = db.relationship('Chatlog', back_populates='bookclub', cascade='all, delete-orphan')


class Chatlog(db.Model, SerializerMixin):
    __tablename__ = "chatlogs"

    serialize_rules = ("-bookclub.chatlogs",)  

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime, onupdate=datetime, nullable=False)

    bookclub_id = db.Column(db.Integer, db.ForeignKey('bookclubs.id'))
    bookclub = db.relationship('Bookclub', back_populates='chatlogs')


# BookClub-Users (many-to-many relationship between user and bookclub through the 'bookclub_users' table)
bookclub_users = db.Table('bookclub_users',
    db.Column('bookclub_id', db.Integer, db.ForeignKey('bookclubs.id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('status', db.String, default='invited', nullable=False),  
    db.Column('invited_at', db.DateTime, default=datetime.utcnow, nullable=False),
    db.Column('responded_at', db.DateTime, nullable=True)
)

