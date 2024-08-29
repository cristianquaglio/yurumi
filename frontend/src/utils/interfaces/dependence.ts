export interface IDependence {
    _id?: string;
    type: string;
    shortName: string;
    fullName: string;
    tributaryType: string;
    tributaryId: string;
    status?: string;
}
