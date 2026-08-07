export interface StudentProfile {
  id: string;
  userId: string;
  name: string;
  age: number;
  grade: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentPayload {
  name: string;
  age: number;
  grade: string;
  userId?: string;
}

export type UpdateStudentPayload = Partial<CreateStudentPayload>;

export interface StudentResponse {
  success: boolean;
  message: string;
  data?: StudentProfile | StudentProfile[];
}