export interface Student {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  class_id: number | null;
  class_name: string | null;
}

export interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  department: string | null;
}

export interface Class {
  id: number;
  name: string;
  section: string | null;
  room_number: string | null;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  teacher_id: number | null;
  class_id: number | null;
  teacher_name: string | null;
  class_name: string | null;
}
