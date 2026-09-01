import random
import string
from datetime import datetime, timezone

from api.database import urls_collection

ALPHABET = string.ascii_letters + string.digits


async def generate_unique_short_code(length: int = 6) -> str:
    while True:
        code = "".join(random.choices(ALPHABET, k=length))
        existing = await urls_collection.find_one({"short_code": code})
        if existing is None:
            return code


async def create_short_url(long_url: str) -> dict:
    # if this long_url was already shortened before, reuse the existing code
    existing = await urls_collection.find_one({"long_url": long_url})
    if existing:
        return existing

    short_code = await generate_unique_short_code()
    document = {
        "short_code": short_code,
        "long_url": long_url,
        "clicks": 0,
        "created_at": datetime.now(timezone.utc),
    }
    await urls_collection.insert_one(document)
    return document


async def get_long_url_and_increment_clicks(short_code: str) -> str | None:
    document = await urls_collection.find_one_and_update(
        {"short_code": short_code},
        {"$inc": {"clicks": 1}},
    )
    return document["long_url"] if document else None


async def get_url_stats(short_code: str) -> dict | None:
    return await urls_collection.find_one({"short_code": short_code})


async def get_all_urls() -> list[dict]:
    results = []
    async for document in urls_collection.find().sort("created_at", -1):
        results.append(document)
    return results


async def delete_url(short_code: str) -> bool:
    result = await urls_collection.delete_one({"short_code": short_code})
    return result.deleted_count == 1