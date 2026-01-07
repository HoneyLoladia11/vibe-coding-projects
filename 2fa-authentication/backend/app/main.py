from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time
from app.config import get_settings
from app.database import engine, Base
from app.routers import auth_router, tools_router, admin_router
from app.routers.ratings_comments import router as ratings_router

settings = get_settings()

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Vibe Coding 2FA API",
    description="API with Telegram 2FA, role-based access, and admin panel",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


# Exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "error": str(exc) if settings.debug else "An error occurred"
        }
    )


# Include routers
app.include_router(auth_router)
app.include_router(tools_router)
app.include_router(admin_router)
app.include_router(ratings_router)


# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Vibe Coding 2FA API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running"
    }


# Health check
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "database": "connected"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )
