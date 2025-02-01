#/server/models.py
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from config import db, bcrypt, association_proxy
from datetime import datetime

class User(db.Model, SerializerMixin):
    _tablename_ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    _password_hash = db.Column(db.String, nullable=False)
    avatar = db.Column(db.String, nullable=True)
    accolade = db.Column(db.String, nullable=True)
    goal = db.Column(db.String, nullable=True)
    streak = db.Column(db.String, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    bookshelves = db.relationship('BookShelf', back_populates='user', cascade='all, delete-orphan')

#One to Many
class BookShelf(db.Model, SerializerMixin):
    _tablename_ = "bookshelves"

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
    db.Column('bookshelf_id', db.Integer, db.ForeignKey('bookshelf.id'), primary_key=True),
    db.Column('book_id', db.Integer, db.ForeignKey('book.id'), primary_key=True)
)

class Book(db.Model, SerializerMixin):
    _tablename_ = "books"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    author = db.Column(db.String, nullable=False)
    synopsis = db.Column(db.String, nullable=False)
    release_date = db.Column(db.Date, nullable=True)
    spin_image = db.Column(db.String, nullable=False)
    cover_image = db.Column(db.String, nullable=False)
    progress = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime, nullable=False)
    last_read_at = db.Column(db.DateTime, nullable=True)

    bookshelves = db.relationship('Bookshelf', secondary='bookshelf_books', back_populates="books")

# BookClub-Book (many-to-many relationship between book and bookclub through the 'bookclub_books' table)
bookclub_books = db.Table('bookclub_books',
    db.Column('bookclub_id', db.Integer, db.ForeignKey('book_club.id'), primary_key=True),
    db.Column('book_id', db.Integer, db.ForeignKey('book.id'), primary_key=True)
)

class Bookclub(db.Model, SerializerMixin):
    _tablename_ = "bookclubs"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime, onupdate=datetime, nullable=False)

    books = db.relationship('Book', secondary='bookclub_books', back_populates='bookclubs')
    chatlogs = db.relationship('Chatlog', back_populates='bookclubs', cascade='all, delete-orphan')

class Chatlog(db.Model, SerializerMixin):
    _tablename_ = "chatlogs"

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime, onupdate=datetime, nullable=False)

    bookclubs = db.relationship('Bookclub', back_populates='chatlogs')

# BookClub-Members (many-to-many relationship between user and bookclub through the 'bookclub_members' table)
bookclub_books = db.Table('bookclub_members',
    db.Column('bookclub_id', db.Integer, db.ForeignKey('book_club.id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True)
)