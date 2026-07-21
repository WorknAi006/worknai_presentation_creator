from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.database.mongodb import database
from app.api.routes.presentation_routes import router as presentation_router
import os

app = FastAPI(
    title="Presentation Creator API",
    version="1.0.0"
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    presentation_router
)
@app.get("/")
async def home():
    return {
        "message": "Presentation Creator Backend Running"
    }


@app.get("/health")
async def health():
    await database.command("ping")

    return {
        "status": "MongoDB Connected"
    }