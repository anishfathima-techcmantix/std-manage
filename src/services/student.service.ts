import { API_Instance } from "../api/axios.instance";
import { API_ENDPOINTS } from "../constants/apiRoutes.constants";
import { CreateStudentPayload, StudentResponse, UpdateStudentPayload } from "../types/student.types";

export const studentService = {
    // Fetch All Student Profiles
    getAllStudents: async (): Promise<StudentResponse> => {
        const response = await API_Instance.get<StudentResponse>(
            API_ENDPOINTS.STUDENTS.BASE
        );
        return response.data;
    },

    // Fetch Student by ID
    getStudentById: async (id: string): Promise<StudentResponse> => {
        const response = await API_Instance.get<StudentResponse>(
            API_ENDPOINTS.STUDENTS.BY_ID(id)
        );
        return response.data;
    },

    // Create Student Profile
    createStudent: async (payload: CreateStudentPayload): Promise<StudentResponse> => {
        const response = await API_Instance.post<StudentResponse>(
            API_ENDPOINTS.STUDENTS.BASE,
            payload
        );
        return response.data;
    },

    // Update Student Profile
    updateStudent: async (id: string, payload: UpdateStudentPayload): Promise<StudentResponse> => {
        const response = await API_Instance.put<StudentResponse>(
            API_ENDPOINTS.STUDENTS.BY_ID(id),
            payload
        );
        return response.data;
    },

    // Delete Student Profile
    deleteStudent: async (id: string): Promise<StudentResponse> => {
        const response = await API_Instance.delete<StudentResponse>(
            API_ENDPOINTS.STUDENTS.BY_ID(id)
        );
        return response.data;
    },
};