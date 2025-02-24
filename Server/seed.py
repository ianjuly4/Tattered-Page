from app import app, db
from models import User, BookShelf, Book, Bookclub, Chatlog

def drop_tables_except_user():
    # Wrap the DB operations inside the app context
    with app.app_context():
        # Get all models except for User
        models_to_drop = [BookShelf, Book, Bookclub, Chatlog]  # Add any other models you want to drop
        
        # Drop the tables of all models except User
        for model in models_to_drop:
            model.__table__.drop(db.engine)
            print(f"Dropped table for {model.__tablename__}")

        # Optionally, create all tables again (if you want to recreate them)
        db.create_all()
        print("All tables except 'User' are dropped and recreated.")

if __name__ == "__main__":
    drop_tables_except_user()
