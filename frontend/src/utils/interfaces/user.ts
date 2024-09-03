export interface IUser {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    dependence: string;
    roles: string[] | undefined;
}

export interface ILoginPayload {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    dependence: string;
    roles: string[];
    status: string;
    isPasswordChanged: boolean;
}
