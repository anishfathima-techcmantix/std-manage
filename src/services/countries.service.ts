import { Country } from "@/types/types";
import { API_Instance } from "@/api/axios.instance";
import { API_ENDPOINTS } from "@/constants/apiRoutes.constants";

export const countriesService = {
    // Get List of Countries
    getCountries: async (): Promise<Country[]> => {
        const response = await API_Instance.get<Country[]>(API_ENDPOINTS.countries.list);
        return response.data || [];
    },
};