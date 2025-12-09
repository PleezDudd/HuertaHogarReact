import api from './api';

/**
 * Servicio de autenticación
 * Maneja el login, logout y verificación de tokens JWT
 */

// Función para decodificar el JWT (sin verificar la firma, solo para leer el payload)
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decodificando token:', error);
    return null;
  }
};

// Obtener el rol del usuario desde el token
export const getUserRole = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const decoded = decodeToken(token);
  return decoded?.rol || decoded?.role || null;
};

// Obtener información del usuario desde el token
export const getUserFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const decoded = decodeToken(token);
  return decoded;
};

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  // Verificar si el token está expirado
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return false;

  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Token expirado
    logout();
    return false;
  }

  return true;
};

// Verificar si el usuario es admin
export const isAdmin = () => {
  const role = getUserRole();
  return role === 'Admin' || role === 'admin' || role === 'ADMIN';
};

// Login: enviar credenciales al backend y recibir el token JWT
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    // El backend debe devolver: { token: "...", usuario: {...} }
    const { token, usuario } = response.data;

    if (token) {
      // Guardar el token en localStorage
      localStorage.setItem('token', token);
      
      // Guardar información del usuario si viene en la respuesta
      if (usuario) {
        localStorage.setItem('usuarioActual', JSON.stringify(usuario));
      } else {
        // Si no viene el usuario, extraerlo del token
        const userFromToken = getUserFromToken();
        if (userFromToken) {
          localStorage.setItem('usuarioActual', JSON.stringify(userFromToken));
        }
      }
      
      localStorage.setItem('sesionActiva', 'true');
      
      return { success: true, token, usuario: usuario || getUserFromToken() };
    } else {
      throw new Error('No se recibió un token del servidor');
    }
  } catch (error) {
    console.error('Error en login:', error);
    // Manejar diferentes tipos de errores
    let errorMessage = 'Error al iniciar sesión';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    return {
      success: false,
      message: errorMessage,
    };
  }
};

// Logout: eliminar el token y limpiar localStorage
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuarioActual');
  localStorage.removeItem('sesionActiva');
};

// Obtener el token actual
export const getToken = () => {
  return localStorage.getItem('token');
};

// Obtener el usuario actual
export const getCurrentUser = () => {
  const usuarioRaw = localStorage.getItem('usuarioActual');
  if (usuarioRaw) {
    try {
      return JSON.parse(usuarioRaw);
    } catch {
      return null;
    }
  }
  // Si no hay usuario guardado, intentar obtenerlo del token
  return getUserFromToken();
};

