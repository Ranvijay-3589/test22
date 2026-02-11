from .student import StudentCreate, StudentUpdate, StudentResponse
from .teacher import TeacherCreate, TeacherUpdate, TeacherResponse
from .class_schema import ClassCreate, ClassUpdate, ClassResponse
from .subject import SubjectCreate, SubjectUpdate, SubjectResponse
from .auth import LoginRequest, RegisterRequest, UserResponse, TokenResponse

__all__ = [
    "StudentCreate", "StudentUpdate", "StudentResponse",
    "TeacherCreate", "TeacherUpdate", "TeacherResponse",
    "ClassCreate", "ClassUpdate", "ClassResponse",
    "SubjectCreate", "SubjectUpdate", "SubjectResponse",
    "LoginRequest", "RegisterRequest", "UserResponse", "TokenResponse",
]
