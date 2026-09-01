import os
from pymongo import AsyncMongoClient
from dotenv import load_dotenv

load_dotenv()

client = AsyncMongoClient(os.getenv("MONGODB_URI"))
db = client["url_shortener"]
urls_collection = db["urls"]