"""
API Middleware - CORS, logging, etc.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def setup_middleware(app: FastAPI):
    """
    Setup middleware for FastAPI app
    
    Args:
        app: FastAPI application
    """
    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # In production, specify actual origins
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Request logging middleware
    @app.middleware("http")
    async def log_requests(request, call_next):
        start_time = time.time()
        logger.info(f"Request: {request.method} {request.url}")
        response = await call_next(request)
        process_time = time.time() - start_time
        logger.info(f"Response: {response.status_code} - {process_time:.3f}s")
        return response

