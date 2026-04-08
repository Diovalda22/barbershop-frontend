import { Storage } from '@/services/storage';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

async function request(path: string, options: RequestInit = {}) {
  const token = Storage.get('admin_token', null) || Storage.get('customer_token', null);
  
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  if (token) {
    // For now the token in storage might be a boolean "true" or a simulated string
    // In a real app, this would be a proper Sanctum/JWT token
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

export const api = {
  get: (path: string) => request(path, { method: 'GET' }),
  post: (path: string, body: any) => request(path, { 
    method: 'POST', 
    body: body instanceof FormData ? body : JSON.stringify(body) 
  }),
  put: (path: string, body: any) => request(path, { 
    method: 'PUT', 
    body: body instanceof FormData ? body : JSON.stringify(body) 
  }),
  delete: (path: string) => request(path, { method: 'DELETE' }),
};
