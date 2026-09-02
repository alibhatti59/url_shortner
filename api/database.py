import os
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.server_api import ServerApi

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("MONGO_URI is not set. Did you create api/.env from .env.example?")

client = MongoClient(MONGO_URI, server_api=ServerApi('1'))

db = client['URL_shortener']

Collection = db['data']
