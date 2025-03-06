// lib/api/rest.ts
import axios from 'axios';

// Create axios instance with default configs
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (redirect to login)
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: async (username: string, password: string) => {
    try {
      const response = await api.post('/login', { username, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Courses endpoints
export const coursesAPI = {
  getAllCourses: async () => {
    try {
      const response = await api.get('/api/courses');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getCourseById: async (id: string) => {
    try {
      const response = await api.get(`/api/courses/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  createCourse: async (courseData: any) => {
    try {
      const response = await api.post('/api/courses', courseData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateCourse: async (id: string, courseData: any) => {
    try {
      const response = await api.put(`/api/courses/${id}`, courseData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  deleteCourse: async (id: string) => {
    try {
      const response = await api.delete(`/api/courses/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Assignments endpoints
export const assignmentsAPI = {
  getCourseAssignments: async (courseId: string) => {
    try {
      const response = await api.get(`/api/courses/${courseId}/assignments`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  createAssignment: async (courseId: string, assignmentData: any) => {
    try {
      const response = await api.post(`/api/courses/${courseId}/assignments`, assignmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Upload assignment submission (file upload)
  submitAssignment: async (assignmentId: string, formData: FormData) => {
    try {
      const response = await api.post(
        `/files/assignment/${assignmentId}`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  downloadSubmission: async (assignmentId: string, submissionId: string) => {
    try {
      const response = await api.get(`/files/assignment/${assignmentId}/${submissionId}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Forums endpoints
export const forumsAPI = {
  getCourseForums: async (courseId: string) => {
    try {
      const response = await api.get(`/api/courses/${courseId}/forums`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  createForum: async (courseId: string, forumData: any) => {
    try {
      const response = await api.post(`/api/courses/${courseId}/forums`, forumData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Resources endpoints
export const resourcesAPI = {
  getCourseResources: async (courseId: string) => {
    try {
      const response = await api.get(`/api/courses/${courseId}/resources`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  uploadResource: async (courseId: string, formData: FormData) => {
    try {
      const response = await api.post(`/files/resource/${courseId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  downloadResource: async (resourceId: string) => {
    try {
      const response = await api.get(`/files/resource/${resourceId}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Grades endpoints
export const gradesAPI = {
  getCourseGrades: async (courseId: string) => {
    try {
      const response = await api.get(`/api/courses/${courseId}/grades`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getUserGrades: async (courseId: string, userId: string) => {
    try {
      const response = await api.get(`/api/courses/${courseId}/user/${userId}/grades`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Users endpoints
export const usersAPI = {
  getAllUsers: async () => {
    try {
      const response = await api.get('/api/users');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getUserById: async (id: string) => {
    try {
      const response = await api.get(`/api/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  createUser: async (userData: any) => {
    try {
      const response = await api.post('/api/users', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateUser: async (id: string, userData: any) => {
    try {
      const response = await api.put(`/api/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  deleteUser: async (id: string) => {
    try {
      const response = await api.delete(`/api/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  uploadProfileImage: async (userId: string, formData: FormData) => {
    try {
      const response = await api.post(`/files/profile/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;