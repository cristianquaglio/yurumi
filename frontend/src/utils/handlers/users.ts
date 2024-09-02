export const userRolesList = () => {
    return [
        {
            id: 'ADMINISTRATIVE',
            value: 'Administrativo',
        },
        {
            id: 'PROFESSIONAL',
            value: 'Profesional',
        },
        {
            id: 'PATIENT',
            value: 'Paciente',
        },
        {
            id: 'TECHNICIAN',
            value: 'Técnico',
        },
        {
            id: 'DIRECTIVE',
            value: 'Directivo',
        },
    ];
};

export enum Roles {
    ADMINISTRATIVE = 'ADMINISTRATIVE',
    PROFESSIONAL = 'PROFESSIONAL',
    PATIENT = 'PATIENT',
    TECHNICIAN = 'TECHNICIAN',
    DIRECTIVE = 'DIRECTIVE',
    USER = 'USER',
}
