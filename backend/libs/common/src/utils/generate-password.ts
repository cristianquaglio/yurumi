export const generatePassword = () => {
  return (
    Math.random().toString(36).slice(2).substring(0, 8) +
    Math.random().toString(36).toUpperCase().slice(2).substring(0, 8)
  );
};
