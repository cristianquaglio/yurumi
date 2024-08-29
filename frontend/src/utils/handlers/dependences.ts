export const dependenceTypes = (type: string) => {
    switch (type) {
        case 'PRIVATE':
            return 'PRIVADO';
        case 'PUBLIC':
            return 'PUBLICO';
        case 'MIXT':
            return 'MIXTO';
    }
};

export const dependenceStatus = (status: string) => {
    switch (status) {
        case 'ACTIVE':
            return 'ACTIVO';
        case 'INACTIVE':
            return 'INACTIVO';
    }
};
