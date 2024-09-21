// Format birthDay to 'dd-mm-yyyy' with leading zeros
export const formatDate = (birthDay: string) => {
    const date = new Date(birthDay);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

// Avoid rendering commas if data is missing
export const formatAddress = (
    address?: string,
    city?: string,
    state?: string,
    country?: string,
) => {
    const parts = [address, city, state, country].filter(Boolean); // Filter out empty values
    return parts.join(', ');
};
