from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import students_router, teachers_router, classes_router, subjects_router, auth_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="School Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(students_router)
app.include_router(teachers_router)
app.include_router(classes_router)
app.include_router(subjects_router)


@app.get("/health")
def health_check():
    return {"status": "healthy"}
