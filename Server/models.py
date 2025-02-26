from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from config import db, bcrypt, association_proxy
from datetime import datetime


class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    serialize_rules = (
        "-books.user",
        "-bookshelves.user",  
        "-bookclubs.users",
        "-chatlogs.users",
        "-books.bookshelves",
        "-books.bookclubs",
    
    )

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    _password_hash = db.Column(db.String, nullable=False)
    avatar = db.Column(db.String, nullable=True)
    accolades = db.Column(db.JSON, nullable=True)
    goals = db.Column(db.JSON, nullable=True)
    streak = db.Column(db.String, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    books = db.relationship('Book', back_populates='user', cascade='all, delete-orphan')
    bookshelves = db.relationship('BookShelf', back_populates='user', cascade='all, delete-orphan')
    bookclubs = db.relationship('Bookclub', secondary='bookclub_users', back_populates='users')
    
    @hybrid_property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))
    
    @validates('username')
    def validate_username(self, key, username):
        if not username:
            raise ValueError("Username cannot be empty")
        if len(username) < 3:
            raise ValueError("Username must be at least 3 characters")
        return username

    @validates('password_hash')
    def validate_password_hash(self, key, password_hash):
        if not password_hash:
            raise ValueError("Password hash cannot be empty")
        return password_hash


class BookShelf(db.Model, SerializerMixin):
    __tablename__ = "bookshelves"

    serialize_rules = (
       "-books.bookshelves",  
        "-user.bookshelves",
        "-books.user",
        "-books.bookclubs", 
    
    )

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=True)
    genre = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('User', back_populates='bookshelves')
    books = db.relationship('Book', secondary='bookshelf_books', back_populates='bookshelves')


    def validate_name(self, key, name):
        if not name:
            raise ValueError("Bookshelf name cannot be empty")
        if len(name) < 3:
            raise ValueError("Bookshelf name must be at least 3 characters")
        return name

    @validates('genre')
    def validate_genre(self, key, genre):
        if not genre:
            raise ValueError("Genre cannot be empty")
        return genre


# Bookshelf-Book (many-to-many relationship between bookshelf and book through the 'bookshelf_books' table)
bookshelf_books = db.Table('bookshelf_books',
    db.Column('bookshelf_id', db.Integer, db.ForeignKey('bookshelves.id'), primary_key=True),
    db.Column('book_id', db.Integer, db.ForeignKey('books.id'), primary_key=True)
)


class Book(db.Model, SerializerMixin):
    __tablename__ = "books"

    serialize_rules = (
        "-user.books", 
        "-bookshelves.books",  
        "-bookclubs.books",

    )

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    author = db.Column(db.String, nullable=False)
    synopsis = db.Column(db.String, nullable=False)
    cover_image = db.Column(db.String, nullable=False)
    progress = db.Column(db.Integer, nullable=True)
    google_key = db.Column(db.String, nullable=False)
    review = db.Column(db.Integer, nullable=True)
    comment = db.Column(db.String, nullable=True)
    published_date = db.Column(db.Date, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    last_read_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=True)

    user = db.relationship('User', back_populates='books')
    bookshelves = db.relationship('BookShelf', secondary='bookshelf_books', back_populates="books")
    bookclubs = db.relationship('Bookclub', secondary='bookclub_books', back_populates='books')

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    @validates('title')
    def validate_title(self, key, title):
        if not title:
            raise ValueError("Title cannot be empty")
        return title

    @validates('author')
    def validate_author(self, key, author):
        if not author:
            raise ValueError("Author cannot be empty")
        return author

    @validates('cover_image')
    def validate_cover_image(self, key, cover_image):
        if not cover_image:
            raise ValueError("Cover image URL cannot be empty")
        return cover_image

    @validates('synopsis')
    def validate_synopsis(self, key, synopsis):
        if not synopsis:
            raise ValueError("Synopsis cannot be empty")
        return synopsis

  
# BookClub-Book (many-to-many relationship between book and bookclub through the 'bookclub_books' table)
bookclub_books = db.Table('bookclub_books',
    db.Column('bookclub_id', db.Integer, db.ForeignKey('bookclubs.id'), primary_key=True),
    db.Column('book_id', db.Integer, db.ForeignKey('books.id'), primary_key=True)
)


class Bookclub(db.Model, SerializerMixin):
    __tablename__ = "bookclubs"

    serialize_rules = (
       "-chatlogs.bookclub", 
        "-users.bookclubs",  
       "-books.bookclubs",
       "-books.bookshelves",
       "-books.user",
        
    )

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    books = db.relationship('Book', secondary='bookclub_books', back_populates='bookclubs')
    users = db.relationship('User', secondary='bookclub_users', back_populates='bookclubs')

    # One-to-One relationship with Chatlog
    chatlog = db.relationship('Chatlog', uselist=False, back_populates='bookclub', cascade='all, delete-orphan')

    @validates('name')
    def validate_name(self, key, name):
        if not name:
            raise ValueError("Bookclub name cannot be empty")
        return name

    @validates('description')
    def validate_description(self, key, description):
        if not description:
            raise ValueError("Description cannot be empty")
        return description


class Chatlog(db.Model, SerializerMixin):
    __tablename__ = "chatlogs"

    serialize_rules = (
        "-bookclub.chatlogs", 
        "-books.chatlogs",  
        "-users.chatlogs", 
    )

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    bookclub_id = db.Column(db.Integer, db.ForeignKey('bookclubs.id'))
    bookclub = db.relationship('Bookclub', back_populates='chatlog')

    @validates('content')
    def validate_content(self, key, content):
        if not content:
            raise ValueError("Content cannot be empty")
        if len(content) < 1:
            raise ValueError("Content must be at least 1 character long")
        return content


# BookClub-Users (many-to-many relationship between user and bookclub through the 'bookclub_users' table)
bookclub_users = db.Table('bookclub_users',
    db.Column('bookclub_id', db.Integer, db.ForeignKey('bookclubs.id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('status', db.String, default='invited', nullable=False),  
    db.Column('invited_at', db.DateTime, default=datetime.utcnow, nullable=False),
    db.Column('responded_at', db.DateTime, nullable=True)
)
