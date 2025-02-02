#/server/app.py
from flask import Flask, render_template, request, make_response, session, send_from_directory
from flask_restful import Api, Resource
from config import app, db, bcrypt, migrate, api, os
from models import User, BookShelf, Bookclub


if __name__ == '__main__':
    app.run(port=5555, debug=True)
