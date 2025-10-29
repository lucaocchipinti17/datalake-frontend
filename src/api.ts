export const API_BASE_URL = "https://4ced2d16-13b2-43ef-a5bb-490e8d209438-00-1j5tlfevdd10t.janeway.replit.dev/api";

const getAuthHeaders = (customHeaders: Record<string, string> = {}) => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customHeaders,
  };
};

const API = {
  put: async (path: string, body: any, customHeaders: Record<string, string> = {}) => {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PUT',
      headers: getAuthHeaders(customHeaders),
      body: JSON.stringify(body),
    });
    return res;
  },
  
  post: async (path: string, body: any, customHeaders: Record<string, string> = {}) => {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: getAuthHeaders(customHeaders),
      body: JSON.stringify(body),
    });
    return res;
  },

  delete: async (path: string, body: any, customHeaders: Record<string, string> = {}) => {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'DELETE',
      headers: getAuthHeaders(customHeaders),
      body: JSON.stringify(body),
    });
    return res;
  },

  get: async (path: string, customHeaders: Record<string, string> = {}) => {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'GET',
      headers: getAuthHeaders(customHeaders),
    });
    return res;
  },

  postFormData: async (path: string, formData: FormData, customHeaders: Record<string, string> = {}) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...customHeaders,
      },
      body: formData,
    });
    return res;
  },
};

export default API;