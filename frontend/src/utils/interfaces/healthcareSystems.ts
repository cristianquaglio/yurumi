interface IContactData {
    email?: string;
    address?: string;
    web?: string;
    phones?: string[];
}

export interface IHealthcareSystems {
    code: string;
    fullName: string;
    shortName: string;
    contactData?: IContactData;
}
