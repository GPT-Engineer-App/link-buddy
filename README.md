# link-buddy

A simple link shortener. Integrate it with a link shortener API, base https://fantastic-eureka-pjrxqq9jjggh96rx-8000.app.github.dev/, using the below Python script (the one the API runs on) as reference:

from fastapi import FastAPI, HTTPException
from typing import Optional
import string
import random
from sqlalchemy import create_engine, Column, Integer, String, Table, MetaData
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import select

app = FastAPI()

# Database setup
DATABASE_URL = "sqlite:///./url_mapping.db"
engine = create_engine(DATABASE_URL)
metadata = MetaData()

# Define the table
url_mapping = Table(
    "url_mapping",
    metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("short_url", String, unique=True, index=True),
    Column("original_url", String),
)

# Create the table
metadata.create_all(engine)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def generate_short_url(length: int =  6) -> str:
    """Generate a random short URL."""
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))

@app.post("/shorten")
async def shorten_url(url: str) -> dict:
    """Shorten a URL."""
    if not url.startswith("http"):
        raise HTTPException(status_code=400, detail="Invalid URL")
    
    short_url = generate_short_url()
    db = SessionLocal()
    while db.execute(select(url_mapping).where(url_mapping.c.short_url == short_url)).first() is not None:
        short_url = generate_short_url()
    
    db.add(url_mapping.insert().values(short_url=short_url, original_url=url))
    db.commit()
    db.close()
    
    return {"short_url": f"https://fantastic-eureka-pjrxqq9jjggh96rx-8000.app.github.dev/{short_url}"}

@app.get("/{short_url}")
async def redirect_to_original(short_url: str) -> dict:
    """Redirect to the original URL."""
    db = SessionLocal()
    result = db.execute(select(url_mapping).where(url_mapping.c.short_url == short_url)).first()
    db.close()
    
    if not result:
        raise HTTPException(status_code=404, detail="URL not found")
    
    return {"original_url": result.original_url}

# Section to run the script and host the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

## Collaborate with GPT Engineer

This is a [gptengineer.app](https://gptengineer.app)-synced repository 🌟🤖

Changes made via gptengineer.app will be committed to this repo.

If you clone this repo and push changes, you will have them reflected in the GPT Engineer UI.

## Setup

```sh
git clone https://github.com/GPT-Engineer-App/link-buddy.git
cd link-buddy
npm i
```

```sh
npm run dev
```

This will run a dev server with auto reloading and an instant preview.

## Tech stack

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Chakra UI](https://chakra-ui.com/)

## Requirements

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
