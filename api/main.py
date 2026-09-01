from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse
from bson import ObjectId

from api.models import URLCreateRequest
from api import services

app = FastAPI(title="snip.sh clone")

BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BASE_DIR.parent / "frontend"

app.mount("/frontend", StaticFiles(directory=FRONTEND_DIR), name="frontend")


def serialize(document: dict) -> dict:
    """Mongo documents contain an ObjectId in _id, which isn't JSON-serializable.
    Convert it to a plain string, or drop it, before returning to the client."""
    document = dict(document)
    document["_id"] = str(document["_id"])
    if "created_at" in document:
        document["created_at"] = document["created_at"].isoformat()
    return document


@app.get("/", include_in_schema=False)
def serve_homepage():
    return FileResponse(FRONTEND_DIR / "index.html")


@app.post("/api/shorten")
async def shorten_url(payload: URLCreateRequest):
    document = await services.create_short_url(str(payload.long_url))
    return serialize(document)


@app.get("/api/stats/{short_code}")
async def get_stats(short_code: str):
    document = await services.get_url_stats(short_code)
    if not document:
        raise HTTPException(status_code=404, detail="Short URL not found")
    return serialize(document)


@app.get("/api/urls")
async def list_urls():
    documents = await services.get_all_urls()
    return [serialize(doc) for doc in documents]


@app.delete("/api/urls/{short_code}")
async def remove_url(short_code: str):
    deleted = await services.delete_url(short_code)
    if not deleted:
        raise HTTPException(status_code=404, detail="Short URL not found")
    return {"message": "Deleted successfully"}


@app.get("/{short_code}")
async def redirect_to_long_url(short_code: str):
    long_url = await services.get_long_url_and_increment_clicks(short_code)
    if not long_url:
        raise HTTPException(status_code=404, detail="Short URL not found")
    return RedirectResponse(url=long_url, status_code=302)