"""
Main entry point for PayFlow AI Backend
"""
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from src.api.routes import router as api_router
from src.api.middleware import setup_middleware

# Load environment variables
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup/shutdown events"""
    # Startup
    print("🚀 Starting PayFlow AI Backend...")
    yield
    # Shutdown
    print("👋 Shutting down PayFlow AI Backend...")

# Create FastAPI app
app = FastAPI(
    title="PayFlow AI API",
    description="AI-powered payment assistant backend",
    version="1.0.0",
    lifespan=lifespan
)

# Setup CORS and middleware
setup_middleware(app)

# Include API routes
app.include_router(api_router, prefix="/api", tags=["api"])

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "ok",
        "service": "PayFlow AI Backend",
        "version": "1.0.0"
    }

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True
    )

