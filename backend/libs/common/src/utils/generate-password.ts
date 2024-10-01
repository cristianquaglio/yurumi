export const generatePassword = () => {
  const lowercase = Math.random().toString(36).slice(2, 3); // 1 letra minúscula
  const uppercase = Math.random().toString(36).toUpperCase().slice(2, 3); // 1 letra mayúscula
  const number = Math.random().toString().slice(2, 3); // 1 número
  const symbols = '!@#$%^&*()_+[]{}|;:,.<>?'; // Simbolos disponibles

  // Escoge 1 símbolo aleatorio
  const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];

  // Genera 4 caracteres adicionales para completar los 8 caracteres
  const randomChars = Math.random().toString(36).slice(2, 6); // 4 caracteres adicionales

  // Concatenar todas las partes (1 minúscula, 1 mayúscula, 1 número, 1 símbolo, 4 aleatorios)
  let password = lowercase + uppercase + number + randomSymbol + randomChars;

  // Mezclar la cadena resultante para evitar un patrón predecible
  password = password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');

  // Asegurar que la longitud sea exactamente 8 caracteres (en caso de ajuste por mezcla)
  return password.substring(0, 8);
};
