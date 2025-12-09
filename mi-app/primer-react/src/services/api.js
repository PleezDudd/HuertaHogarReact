// API client usando fetch nativo (compatible con webpack 5)
const BASE_URL = 'http://localhost:8080';

// Función helper para hacer requests
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Agregar token JWT si existe
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    // Manejar errores 401 (token expirado/inválido)
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuarioActual');
      localStorage.removeItem('sesionActiva');
      // Redirigir al login si no estamos ya ahí
      if (window.location.pathname !== '/unete') {
        window.location.href = '/unete';
      }
      throw new Error('Token inválido o expirado');
    }

    // Parsear la respuesta JSON (si existe)
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (e) {
        data = {};
      }
    } else {
      data = {};
    }

    // Crear un objeto similar a la respuesta de axios
    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config,
    };
  } catch (error) {
    // Si es un error de red o parsing, lanzarlo
    if (error.message === 'Token inválido o expirado') {
      throw error;
    }
    // Para otros errores, crear un objeto similar a axios error
    throw {
      response: {
        status: error.status || 500,
        data: { message: error.message || 'Error de conexión' },
      },
      message: error.message || 'Error de conexión',
    };
  }
};

// API object con métodos similares a axios
const api = {
  get: (endpoint, config = {}) => {
    return request(endpoint, { ...config, method: 'GET' });
  },

  post: (endpoint, data, config = {}) => {
    return request(endpoint, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put: (endpoint, data, config = {}) => {
    return request(endpoint, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: (endpoint, config = {}) => {
    return request(endpoint, { ...config, method: 'DELETE' });
  },

  patch: (endpoint, data, config = {}) => {
    return request(endpoint, {
      ...config,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};

export default api;

