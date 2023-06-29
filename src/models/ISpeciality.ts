export interface ISpeciality {
    id: string,
    name: string,
    params?: {
        gender?: string,
        maxAge?: number,
        minAge?: number
    }
}