// types/index.ts - Definiciones de tipos para la aplicación

// Usuario
export interface User {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password?: string; // Solo para la creación
    roles: Role[];
    profileimage?: string;
    lastaccess?: number;
    isdeleted?: boolean;
  }
  
  // Rol
  export interface Role {
    id: number;
    name: string;
    shortname: string;
    description?: string;
    sortorder?: number;
    archetype?: string;
  }
  
  // Curso
  export interface Course {
    id: number;
    name: string;
    shortname: string;
    description?: string;
    startdate?: number; // timestamps
    enddate?: number;
    visible?: boolean;
    category?: number;
  }
  
  // Tarea
  export interface Assignment {
    id: number;
    courseid: number;
    name: string;
    description?: string;
    duedate?: number;
    maxgrade?: number;
    allowsubmissionsfromdate?: number;
    cutoffdate?: number;
    gradingduedate?: number;
    attachments?: ResourceFile[];
  }
  
  // Foro
  export interface Forum {
    id: number;
    courseid: number;
    name: string;
    description?: string;
    type?: string;
    timecreated?: number;
  }
  
  // Discusión del foro
  export interface ForumDiscussion {
    id: number;
    forumid: number;
    name: string;
    userid: number;
    message: string;
    timecreated: number;
  }
  
  // Publicación del foro
  export interface ForumPost {
    id: number;
    discussionid: number;
    userid: number;
    message: string;
    timecreated: number;
    parent?: number;
  }
  
  // Recurso (archivo)
  export interface ResourceFile {
    id: number;
    courseid: number;
    name: string;
    filepath: string;
    mimetype?: string;
    filesize?: number;
    timecreated?: number;
    userid?: number;
  }
  
  // Entrega de tarea
  export interface Submission {
    id: number;
    assignmentid: number;
    userid: number;
    status: 'draft' | 'submitted' | 'graded';
    timecreated: number;
    timemodified?: number;
    grade?: number;
    graderid?: number;
    filepath?: string;
    filename?: string;
    filesize?: number;
    mimetype?: string;
    comment?: string;
  }
  
  // Respuesta de login
  export interface LoginResponse {
    success: boolean;
    user_id: number;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    roles: Role[];
    message: string;
  }
  
  // Error de API
  export interface ApiError {
    message: string;
    statusCode?: number;
    details?: any;
  }