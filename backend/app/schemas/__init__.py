from .student import StudentCreate, StudentUpdate, StudentResponse
from .teacher import TeacherCreate, TeacherUpdate, TeacherResponse
from .class_schema import ClassCreate, ClassUpdate, ClassResponse
from .subject import SubjectCreate, SubjectUpdate, SubjectResponse
from .auth import UserCreate, UserResponse, LoginRequest, LoginResponse

__all__ = [
    "StudentCreate", "StudentUpdate", "StudentResponse",
    "TeacherCreate", "TeacherUpdate", "TeacherResponse",
    "ClassCreate", "ClassUpdate", "ClassResponse",
    "SubjectCreate", "SubjectUpdate", "SubjectResponse",
    "UserCreate", "UserResponse", "LoginRequest", "LoginResponse",
]
