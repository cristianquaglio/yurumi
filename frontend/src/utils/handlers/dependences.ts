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

export const listDependenceTypes = () => {
    return [
        { id: 'PUBLIC', value: 'Publico' },
        { id: 'PRIVATE', value: 'Privado' },
        { id: 'MIXT', value: 'Mixto' },
    ];
};

export const listTributaryTypes = () => {
    return [{ id: 'CUIT', value: 'CUIT' }];
};

export const listDependenceStatus = () => {
    return [
        { id: 'ACTIVE', value: 'ACTIVO' },
        { id: 'INACTIVE', value: 'INACTIVO' },
    ];
};
