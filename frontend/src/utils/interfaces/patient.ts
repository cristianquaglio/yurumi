import { IHealthcareSystems } from './healthcareSystems';

interface IContactData {
    email?: string;
    phoneNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
}

export interface IPatient {
    _id?: string;
    firstName: string;
    lastName: string;
    gender: string;
    bloodType: string;
    nationality: string;
    documentType: string;
    documentNumber: string;
    birthDay: string;
    birthTime: string;
    healthcareSystem: IHealthcareSystems;
    healthcareNumber: string;
    contactData?: IContactData;
}
