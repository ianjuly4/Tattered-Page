from app import app, db  # Make sure to import your app and db
from models import User, BookShelf, Book, Bookclub, Chatlog

def drop_all_tables():
    # Wrap the DB operations inside the app context
    with app.app_context():
        # Drop all tables
        db.create_all()
        print("All tables created.")

if __name__ == "__main__":
    drop_all_tables()
