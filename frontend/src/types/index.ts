export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  class_id: number | null;
}

export interface Teacher {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  department: string | null;
}

export interface SchoolClass {
  id: number;
  name: string;
  grade_level: number;
  section: string | null;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  teacher_id: number | null;
  class_id: number | null;
}
