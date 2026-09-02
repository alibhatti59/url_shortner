# URL Shortener

A full-stack URL shortener built with FastAPI, PyMongo, and vanilla JavaScript. Shorten long URLs into random 6-character codes, expand them back, generate QR codes, and manage saved links.

## Features

- Shorten a long URL into a short, random, unique code
- Redirect a short code to its original URL
- Expand a short code back to its long URL without redirecting
- List all saved links
- Delete a saved link
- Generate a QR code for any short URL

## Tech stack

- **Backend:** Python, FastAPI, PyMongo
- **Database:** MongoDB Atlas
- **Frontend:** HTML, CSS, vanilla JavaScript

## Project structure

```
url-shortener/
├── api/
│   ├── main.py            # FastAPI app and route definitions
│   ├── config.py          # MongoDB connection (reads MONGO_URI from .env)
│   ├── schema.py          # Pydantic data models
│   ├── requirements.txt
│   └── .env.example
└── web/
    ├── index.html
    ├── style.css
    └── script.js
```

## Setup

1. Clone the repo and enter the backend folder:
   ```bash
   git clone <your-repo-url>
   cd url-shortener/api
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv

   # Windows
   .venv\Scripts\activate

   # Mac/Linux
   source .venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Copy `.env.example` to `.env` and add your own MongoDB Atlas connection string:
   ```bash
   cp .env.example .env
   ```
   If your network blocks DNS SRV lookups, use the non-SRV connection string from Atlas (Connect → Drivers → older driver version) instead of the `mongodb+srv://` one.

5. Run the API:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

6. Open `web/index.html` with a local server (e.g. VS Code's Live Server extension) — it expects the API at `http://127.0.0.1:8000`.

## API endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/shortner?longUrl=` | Create (or reuse) a short code for a URL |
| GET | `/expand?short_url=` | Look up the long URL for a short code |
| GET | `/urls` | List all saved links |
| DELETE | `/Delete?long_url=` | Delete a saved link |
| GET | `/Qr?short_url=` | Generate a QR code PNG for a short URL |
| GET | `/{short_url}` | Redirect a short code to its long URL |

## Notes

- Short codes are generated with Python's `secrets` module (cryptographically secure randomness), not derived from the URL — shortening the same URL twice returns the same saved code, but the code itself isn't predictable from the URL.
- `.env` is git-ignored; never commit real database credentials. `.env.example` documents the required variable without real values.

## Author

**Ali Hassnain Bhatti**

## License

MIT