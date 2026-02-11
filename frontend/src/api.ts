import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
})

export interface LoginPayload {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  user: {
    id: number
    username: string
    email: string
    full_name: string | null
  }
}

// --- Students ---
export const getStudents = (search?: string) =>
  api.get('/students/', { params: { search } })

export const getStudent = (id: number) =>
  api.get(`/students/${id}`)

export const createStudent = (data: Record<string, unknown>) =>
  api.post('/students/', data)

export const updateStudent = (id: number, data: Record<string, unknown>) =>
  api.put(`/students/${id}`, data)

export const deleteStudent = (id: number) =>
  api.delete(`/students/${id}`)

// --- Teachers ---
export const getTeachers = (search?: string) =>
  api.get('/teachers/', { params: { search } })

export const getTeacher = (id: number) =>
  api.get(`/teachers/${id}`)

export const createTeacher = (data: Record<string, unknown>) =>
  api.post('/teachers/', data)

export const updateTeacher = (id: number, data: Record<string, unknown>) =>
  api.put(`/teachers/${id}`, data)

export const deleteTeacher = (id: number) =>
  api.delete(`/teachers/${id}`)

// --- Classes ---
export const getClasses = (search?: string) =>
  api.get('/classes/', { params: { search } })

export const getClass = (id: number) =>
  api.get(`/classes/${id}`)

export const createClass = (data: Record<string, unknown>) =>
  api.post('/classes/', data)

export const updateClass = (id: number, data: Record<string, unknown>) =>
  api.put(`/classes/${id}`, data)

export const deleteClass = (id: number) =>
  api.delete(`/classes/${id}`)

// --- Subjects ---
export const getSubjects = (search?: string) =>
  api.get('/subjects/', { params: { search } })

export const getSubject = (id: number) =>
  api.get(`/subjects/${id}`)

export const createSubject = (data: Record<string, unknown>) =>
  api.post('/subjects/', data)

export const updateSubject = (id: number, data: Record<string, unknown>) =>
  api.put(`/subjects/${id}`, data)

export const deleteSubject = (id: number) =>
  api.delete(`/subjects/${id}`)

// --- Auth ---
export const login = (payload: LoginPayload) =>
  api.post<LoginResponse>('/auth/login', payload)

export default api
