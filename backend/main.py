from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routes import students, teachers, classes, subjects, auth

# Create all tables
Base.metadata.create_all(bind=engine)


app = FastAPI(title="School Management API", version="1.0.0")

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(students.router, prefix="/api/students", tags=["Students"])
app.include_router(teachers.router, prefix="/api/teachers", tags=["Teachers"])
app.include_router(classes.router, prefix="/api/classes", tags=["Classes"])
app.include_router(subjects.router, prefix="/api/subjects", tags=["Subjects"])


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/hello")
def hello():
    return {"message": "hello"}


@app.get("/api")
def api_root():
    return {
        "message": "School Management API",
        "version": "1.0.0",
        "endpoints": {
            "students": "/api/students",
            "teachers": "/api/teachers",
            "classes": "/api/classes",
            "subjects": "/api/subjects",
        },
    }
