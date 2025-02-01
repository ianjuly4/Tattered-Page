#/server/app.py
from flask import Flask, render_template, request, make_response, session, send_from_directory
from flask_restful import Api, Resource
from config import app, db, bcrypt, migrate, api, os
from models import Wine, Review, User  
