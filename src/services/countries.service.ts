import { API_Instance } from "@/api/axios.instance";
import { API_ENDPOINTS } from "@/constants/apiRoutes.constants";
import { Country } from "@/types/countries.types";

export const countriesService = {
    // Get List of Countries
    getCountries: async (): Promise<Country[]> => {
        const response = await API_Instance.get(API_ENDPOINTS.countries.list);
        const body = (response as any)?.data ?? response;

        if (Array.isArray(body)) return body as Country[];
        if (Array.isArray(body.data)) return body.data as Country[];
        if (Array.isArray(body.results)) return body.results as Country[];
        if (Array.isArray(body.payload?.data)) return body.payload.data as Country[];

        return [];
    },
};