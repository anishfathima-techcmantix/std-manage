import { Profession } from "@/types/types";
import { API_Instance } from "@/api/axios.instance";
import { API_ENDPOINTS } from "@/constants/apiRoutes.constants";

export const professionsService = {
    // Get List of Professions
    getProfessions: async (): Promise<Profession[]> => {
        const response = await API_Instance.get<Profession[]>(API_ENDPOINTS.professions.list);
        return response.data || [];
    },
};