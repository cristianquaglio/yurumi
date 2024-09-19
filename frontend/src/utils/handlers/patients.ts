export const listGenders = () => {
    return [
        { id: 'MALE', value: 'Masculino' },
        { id: 'FEMALE', value: 'Femenino' },
        { id: 'OTHER', value: 'Otro' },
    ];
};

export const listBloodTypes = () => {
    return [
        { id: 'A+', value: 'A+' },
        { id: 'A-', value: 'A-' },
        { id: 'B+', value: 'B+' },
        { id: 'B-', value: 'B-' },
        { id: 'AB+', value: 'AB+' },
        { id: 'AB-', value: 'AB-' },
        { id: 'O+', value: 'O+' },
        { id: 'O-', value: 'O-' },
    ];
};

export const listNationalities = () => {
    return [
        { id: 'ARG', value: 'Argentina' },
        { id: 'BRA', value: 'Brasilera' },
        { id: 'PAR', value: 'Paraguaya' },
        { id: 'URU', value: 'Uruguaya' },
        { id: 'BOL', value: 'Boliviana' },
        { id: 'CHI', value: 'Chilena' },
        { id: 'OTHER', value: 'Otra' },
    ];
};

export const listDocumentTypes = () => {
    return [
        { id: 'DNI', value: 'DNI' },
        { id: 'PASSPORT', value: 'Pasaporte' },
        { id: 'CI', value: 'Cédula de Identidad' },
        { id: 'FOREIGN_ID', value: 'ID extranjero' },
    ];
};

export const listHealthcareSystems = () => {
    return [
        // { id: 'IPS', value: 'IPS' },
        // { id: 'OSDE', value: 'OSDE' },
        // { id: 'PAMI', value: 'PAMI' },
        // { id: 'OTHER', value: 'Otra' },
    ];
}