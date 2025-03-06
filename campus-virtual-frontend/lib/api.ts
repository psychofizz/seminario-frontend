// lib/api.ts - Cliente para API RESTful y GraphQL

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Cliente REST básico
export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  
  // Si la respuesta no es exitosa, lanzamos un error
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || `Error API: ${response.status}`);
  }
  
  // Para requests que no devuelven JSON (como DELETE)
  if (response.status === 204) {
    return null;
  }
  
  // Intentamos parsear la respuesta como JSON
  return await response.json();
}

// Cliente GraphQL básico
export async function fetchGraphQL(query: string, variables = {}) {
  const response = await fetch(`${API_URL}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await response.json();

  if (json.errors) {
    console.error('GraphQL Error:', json.errors);
    throw new Error('Error en la consulta GraphQL');
  }

  return json.data;
}

// Función para manejar el login (solo REST)
export async function login(username: string, password: string) {
  return fetchAPI('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

// Funciones para cursos (usando REST)
export const courseAPI = {
  // Obtener todos los cursos
  getAll: () => fetchAPI('/api/courses'),
  
  // Obtener un curso específico
  getById: (id: number | string) => fetchAPI(`/api/courses/${id}`),
  
  // Crear un nuevo curso
  create: (courseData: any) => fetchAPI('/api/courses', {
    method: 'POST',
    body: JSON.stringify(courseData),
  }),
  
  // Actualizar un curso
  update: (id: number | string, courseData: any) => fetchAPI(`/api/courses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(courseData),
  }),
  
  // Eliminar un curso
  delete: (id: number | string) => fetchAPI(`/api/courses/${id}`, {
    method: 'DELETE',
  }),
  
  // Obtener tareas de un curso
  getAssignments: (id: number | string) => fetchAPI(`/api/courses/${id}/assignments`),
  
  // Crear tarea en un curso
  createAssignment: (courseId: number | string, assignmentData: any) => fetchAPI(`/api/courses/${courseId}/assignments`, {
    method: 'POST',
    body: JSON.stringify(assignmentData),
  }),
  
  // Obtener foros de un curso
  getForums: (id: number | string) => fetchAPI(`/api/courses/${id}/forums`),
  
  // Obtener recursos de un curso
  getResources: (id: number | string) => fetchAPI(`/api/courses/${id}/resources`),
};

// Funciones para usuarios (usando REST)
export const userAPI = {
  getAll: () => fetchAPI('/api/users'),
  getById: (id: number | string) => fetchAPI(`/api/users/${id}`),
  create: (userData: any) => fetchAPI('/api/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  update: (id: number | string, userData: any) => fetchAPI(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  delete: (id: number | string) => fetchAPI(`/api/users/${id}`, {
    method: 'DELETE',
  }),
};

// Funciones para manejo de archivos
export const fileAPI = {
  uploadAssignment: (assignmentId: number | string, file: File, formData?: FormData) => {
    const data = formData || new FormData();
    data.append('file', file);
    return fetch(`${API_URL}/files/assignment/${assignmentId}`, {
      method: 'POST',
      body: data,
    }).then(response => {
      if (!response.ok) throw new Error('Error al subir archivo');
      return response.json();
    });
  },
  
  uploadResource: (courseId: number | string, file: File, formData?: FormData) => {
    const data = formData || new FormData();
    data.append('file', file);
    return fetch(`${API_URL}/files/resource/${courseId}`, {
      method: 'POST',
      body: data,
    }).then(response => {
      if (!response.ok) throw new Error('Error al subir recurso');
      return response.json();
    });
  },
};

// Consultas GraphQL comunes
export const graphqlQueries = {
  getAllRoles: `
    query GetAllRoles {
      roles {
        id
        name
        shortname
        description
        sortorder
        archetype
      }
    }
  `,
  
  getAllCourses: `
    query GetAllCourses {
      courses {
        id
        name
        shortname
        description
        startdate
        enddate
        visible
      }
    }
  `,
};