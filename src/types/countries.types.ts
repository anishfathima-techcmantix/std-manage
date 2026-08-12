export interface Country {
    id: string;
    name: string;
    code: string;
}

export interface Profession {
    id: string;
    title: string;
}

// Generic type for endpoints returning lists in different shapes
export type ListResponse<T> =
    | T[]
    | { data?: T[] }
    | { results?: T[] }
    | { payload?: { data?: T[] } };
