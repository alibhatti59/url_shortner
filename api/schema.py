from pydantic import BaseModel
from typing import Dict,List

class MongoDBschema (BaseModel):
    long_url: str
    short_url :str