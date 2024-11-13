import * as jwtDecode from 'jwt-decode';

export const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const isTokenExpired = (token: string) => {
  const decoded: any = jwtDecode.jwtDecode(token); // Use jwtDecode.default to decode
  return decoded.exp * 1000 < Date.now();
};

export const clearToken = () => {
  localStorage.removeItem('token');
};

export const isTokenValid = (): boolean => {
    const token = localStorage.getItem('token');
    if (!token) return false;
  
    try {
      const decoded: any = jwtDecode.jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  };

  export const getUsernameFromToken = (): string | null => {
    const token = getToken();
    if (!token) return null;
  
    try {
      const decoded: any = jwtDecode.jwtDecode(token);
      return decoded.username || null;
    } catch (error) {
      return null;
    }
  };
