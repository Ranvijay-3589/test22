from .students import router as students_router
from .teachers import router as teachers_router
from .classes import router as classes_router
from .subjects import router as subjects_router

__all__ = ["students_router", "teachers_router", "classes_router", "subjects_router"]
