export interface IUser extends IAdminUser {
    id?: string;
    roles?: string[];
    status?: string;
}

export interface IAdminUser {
    firstName: string;
    lastName: string;
    email: string;
    company?: string;
}
