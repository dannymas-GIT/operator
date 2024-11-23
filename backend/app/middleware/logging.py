from fastapi import Request
import time
import logging

logger = logging.getLogger(__name__)

async def log_requests(request: Request, call_next):
    """Log request details and timing"""
    start_time = time.time()
    
    # Process the request
    response = await call_next(request)
    
    # Log after processing
    duration = time.time() - start_time
    logger.info(
        f"Path: {request.url.path} "
        f"Method: {request.method} "
        f"Status: {response.status_code} "
        f"Duration: {duration:.2f}s"
    )
    
    return response 