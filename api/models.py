from pydantic import BaseModel, HttpUrl


class URLCreateRequest(BaseModel):
    long_url: HttpUrl