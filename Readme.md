# URL Shortener

A full-stack URL shortener — paste a long URL, get a short one back, and track clicks on it.

**Stack:** FastAPI (Python) · MongoDB Atlas · HTML/CSS/JS

---

## Features

- Shorten a URL into a random 6-character code
- Redirect short → long via HTTP 302
- Click tracking per link
- Duplicate detection (same URL reuses its existing code)
- List and delete saved links

---

## Run Locally

```bash
git clone https://github.com/YOUR_USERNAME/url-shortener.git
cd url-shortener/api

python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env            # then add your MongoDB URI
uvicorn main:app --reload
```

Open `http://localhost:8000`.

### Environment Variables

```
MONGODB_URI=mongodb://<user>:<password>@<host1>,<host2>,<host3>/?ssl=true&replicaSet=<name>&authSource=admin
```

---

## API

| Method   | Endpoint             | Description                        |
|----------|-----------------------|-------------------------------------|
| `POST`   | `/api/shorten`         | Create a short URL                  |
| `GET`    | `/api/stats/{code}`    | Get a link's details + click count  |
| `GET`    | `/api/urls`             | List all links                      |
| `DELETE` | `/api/urls/{code}`      | Delete a link                       |
| `GET`    | `/{code}`                | Redirect to the original URL        |

```bash
curl -X POST http://localhost:8000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"long_url": "https://example.com/a/very/long/path"}'
```

---

## Project Structure

```
api/            FastAPI backend (routes, DB logic, services)
frontend/       Static HTML/CSS/JS
```

---

## What I Learned

- Building a layered backend (routes → services → database) instead of putting everything in one file
- Atomic database operations (`find_one_and_update`) to avoid race conditions on click counting
- Debugging DNS/SRV connection failures between MongoDB Atlas and a local network
- Why relative file paths break depending on where a script is run from, and using `Path(__file__)` to fix it
- Deploying a Python backend + static frontend on Render

## Author

**Ali Hassnain Bhatti**

## License

Built for learning purposes.