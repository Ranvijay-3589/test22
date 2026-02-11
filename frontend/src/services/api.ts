import axios from "axios";
import type { Student, Teacher, Class, Subject } from "../types";

const api = axios.create({ baseURL: "/api" });

// Students
export const getStudents = (search?: string) =>
  api.get<Student[]>("/students/", { params: { search } }).then((r) => r.data);

export const getStudent = (id: number) =>
  api.get<Student>(`/students/${id}`).then((r) => r.data);

export const createStudent = (data: Omit<Student, "id" | "class_name">) =>
  api.post<Student>("/students/", data).then((r) => r.data);

export const updateStudent = (
  id: number,
  data: Partial<Omit<Student, "id" | "class_name">>
) => api.put<Student>(`/students/${id}`, data).then((r) => r.data);

export const deleteStudent = (id: number) => api.delete(`/students/${id}`);

// Teachers
export const getTeachers = (search?: string) =>
  api.get<Teacher[]>("/teachers/", { params: { search } }).then((r) => r.data);

export const getTeacher = (id: number) =>
  api.get<Teacher>(`/teachers/${id}`).then((r) => r.data);

export const createTeacher = (data: Omit<Teacher, "id">) =>
  api.post<Teacher>("/teachers/", data).then((r) => r.data);

export const updateTeacher = (id: number, data: Partial<Omit<Teacher, "id">>) =>
  api.put<Teacher>(`/teachers/${id}`, data).then((r) => r.data);

export const deleteTeacher = (id: number) => api.delete(`/teachers/${id}`);

// Classes
export const getClasses = (search?: string) =>
  api.get<Class[]>("/classes/", { params: { search } }).then((r) => r.data);

export const getClass = (id: number) =>
  api.get<Class>(`/classes/${id}`).then((r) => r.data);

export const createClass = (data: Omit<Class, "id">) =>
  api.post<Class>("/classes/", data).then((r) => r.data);

export const updateClass = (id: number, data: Partial<Omit<Class, "id">>) =>
  api.put<Class>(`/classes/${id}`, data).then((r) => r.data);

export const deleteClass = (id: number) => api.delete(`/classes/${id}`);

// Subjects
export const getSubjects = (search?: string) =>
  api
    .get<Subject[]>("/subjects/", { params: { search } })
    .then((r) => r.data);

export const getSubject = (id: number) =>
  api.get<Subject>(`/subjects/${id}`).then((r) => r.data);

export const createSubject = (
  data: Omit<Subject, "id" | "teacher_name" | "class_name">
) => api.post<Subject>("/subjects/", data).then((r) => r.data);

export const updateSubject = (
  id: number,
  data: Partial<Omit<Subject, "id" | "teacher_name" | "class_name">>
) => api.put<Subject>(`/subjects/${id}`, data).then((r) => r.data);

export const deleteSubject = (id: number) => api.delete(`/subjects/${id}`);
