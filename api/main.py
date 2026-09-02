from fastapi import FastAPI
from database import Collection
import hashlib
import qrcode
import io
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse,RedirectResponse

app = FastAPI()

origins = [
    "http://localhost:5500",
    "http://127.0.0.1:5501"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def generateShortCode(longUrl):
    hash_value = hashlib.md5(longUrl.encode()).hexdigest()
    return hash_value[:4]

@app.get("/health")
def health_check():
    return { "status": "Healthy" }

@app.post("/shortner")
def shorten(longUrl :str):
    Short_Url= generateShortCode(longUrl)
    short_url_display= f"http://127.0.0.1:8000/{Short_Url}"

    existing_record = Collection.find_one({"long_url": longUrl})

    if not existing_record:
        Collection.insert_one({
            "long_url" : longUrl,
            "short_url" : Short_Url
        })

    return{
        "long_url" : longUrl,
        "short_url" : short_url_display
    }
@app.get("/Qr")
def QR_code(short_url:str):
    img = qrcode.make(short_url)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return StreamingResponse(buf, media_type="image/png")

@app.get("/expand")
def expand(short_url: str):
    document = Collection.find_one({"short_url": short_url})
    if document:
        return {
            "short_url": document["short_url"],
            "long_url": document["long_url"]
        }

    return {"error": "Short URL not found"}

@app.delete("/Delete")
def Delete(long_url:str):
    Delete_Result = Collection.delete_one({"long_url": long_url})
    if Delete_Result.deleted_count==1:
     return{
         "Message": "Url deleted sucessfully"
    }
    return{
        "Message":"Url not found"
    }
    
@app.get("/urls")
def list_urls():
    results = []
    for doc in Collection.find({}):
        data = {
            "long_url": doc["long_url"],
            "short_url": doc["short_url"]
        }
        results.append(data)    

    return results

@app.get("/{short_url}")
def redirect_short_url(short_url: str):
    document = Collection.find_one({"short_url": short_url})
    if document:
        return RedirectResponse(document["long_url"])
    return {"error": "Short URL not found"}