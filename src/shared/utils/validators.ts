export const validators = {
  isEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isUUID: (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  },

  isNotEmpty: (value: string): boolean => {
    return value.trim().length > 0;
  },

  isMinLength: (value: string, minLength: number): boolean => {
    return value.length >= minLength;
  },

  isMaxLength: (value: string, maxLength: number): boolean => {
    return value.length <= maxLength;
  },
};