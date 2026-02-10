import axios from 'axios';
import { Student, Teacher, SchoolClass, Subject } from '../types';

const api = axios.create({ baseURL: '/api' });

// Students
export const getStudents = (search?: string) =>
  api.get<Student[]>('/students/', { params: search ? { search } : {} });
export const getStudent = (id: number) =>
  api.get<Student>(`/students/${id}`);
export const createStudent = (data: Omit<Student, 'id'>) =>
  api.post<Student>('/students/', data);
export const updateStudent = (id: number, data: Partial<Student>) =>
  api.put<Student>(`/students/${id}`, data);
export const deleteStudent = (id: number) =>
  api.delete(`/students/${id}`);

// Teachers
export const getTeachers = (search?: string) =>
  api.get<Teacher[]>('/teachers/', { params: search ? { search } : {} });
export const getTeacher = (id: number) =>
  api.get<Teacher>(`/teachers/${id}`);
export const createTeacher = (data: Omit<Teacher, 'id'>) =>
  api.post<Teacher>('/teachers/', data);
export const updateTeacher = (id: number, data: Partial<Teacher>) =>
  api.put<Teacher>(`/teachers/${id}`, data);
export const deleteTeacher = (id: number) =>
  api.delete(`/teachers/${id}`);

// Classes
export const getClasses = (search?: string) =>
  api.get<SchoolClass[]>('/classes/', { params: search ? { search } : {} });
export const getClass = (id: number) =>
  api.get<SchoolClass>(`/classes/${id}`);
export const createClass = (data: Omit<SchoolClass, 'id'>) =>
  api.post<SchoolClass>('/classes/', data);
export const updateClass = (id: number, data: Partial<SchoolClass>) =>
  api.put<SchoolClass>(`/classes/${id}`, data);
export const deleteClass = (id: number) =>
  api.delete(`/classes/${id}`);

// Subjects
export const getSubjects = (search?: string) =>
  api.get<Subject[]>('/subjects/', { params: search ? { search } : {} });
export const getSubject = (id: number) =>
  api.get<Subject>(`/subjects/${id}`);
export const createSubject = (data: Omit<Subject, 'id'>) =>
  api.post<Subject>('/subjects/', data);
export const updateSubject = (id: number, data: Partial<Subject>) =>
  api.put<Subject>(`/subjects/${id}`, data);
export const deleteSubject = (id: number) =>
  api.delete(`/subjects/${id}`);
