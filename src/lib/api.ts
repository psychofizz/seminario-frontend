import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Add a request interceptor to include the token in requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface LoginCredentials {
  account: string;
  password: string;
}

export interface Course {
  id: number;
  name: string;
  code: string;
  teacher: string;
  period: string;
}

export const login = async (credentials: LoginCredentials) => {
  const response = await api.post('/login', credentials);
  const { access_token } = response.data;
  localStorage.setItem('token', access_token);
  return response.data;
};

export const getCourses = async () => {
  const response = await api.get<Course[]>('/courses');
  return response.data;
};

export default api;