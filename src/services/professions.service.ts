import { API_Instance } from "@/api/axios.instance";
import { API_ENDPOINTS } from "@/constants/apiRoutes.constants";
import { Profession } from "@/types/countries.types";

export const professionsService = {
    // Get List of Professions
    getProfessions: async (): Promise<Profession[]> => {
        const response = await API_Instance.get(API_ENDPOINTS.professions.list);
        const body = (response as any)?.data ?? response;

        if (Array.isArray(body)) return body as Profession[];
        if (Array.isArray(body.data)) return body.data as Profession[];
        if (Array.isArray(body.results)) return body.results as Profession[];
        if (Array.isArray(body.payload?.data)) return body.payload.data as Profession[];

        return [];
    },
};