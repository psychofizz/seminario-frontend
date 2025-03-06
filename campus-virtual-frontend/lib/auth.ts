// lib/auth.ts - Funciones de autenticación y manejo de sesiones

import { login as apiLogin } from './api';

// Tipos
type User = {
  user_id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  roles: Array<{
    id: number;
    name: string;
    shortname: string;
  }>;
};

// Verificar si hay sesión activa (usuario logueado)
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  const user = localStorage.getItem('campus_user');
  return !!user;
}

// Obtener datos del usuario actual
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('campus_user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as User;
  } catch (e) {
    console.error('Error parsing user data:', e);
    return null;
  }
}

// Función para iniciar sesión
export async function login(username: string, password: string): Promise<User> {
  try {
    const response = await apiLogin(username, password);
    
    if (response.success) {
      // Guardar datos del usuario en localStorage
      const userData = {
        user_id: response.user_id,
        username: response.username,
        firstname: response.firstname,
        lastname: response.lastname,
        email: response.email,
        roles: response.roles
      };
      
      localStorage.setItem('campus_user', JSON.stringify(userData));
      return userData;
    }
    
    throw new Error(response.message || 'Error de inicio de sesión');
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Función para cerrar sesión
export function logout(): void {
  localStorage.removeItem('campus_user');
  // Redirigir al usuario a la página de inicio de sesión
  window.location.href = '/auth/login';
}

// Verificar si el usuario tiene un rol específico
export function hasRole(role: string): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  
  return user.roles.some(r => r.shortname === role);
}

// Verificar si el usuario es administrador
export function isAdmin(): boolean {
  return hasRole('admin');
}