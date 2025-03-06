// types/index.ts

// Auth types
export type Role = {
    id: number;
    name: string;
    shortname: string;
    description?: string;
    sortorder?: number;
    archetype?: string;
  };
  
  export type User = {
    user_id: number;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    roles: Role[];
    profilePic?: string;
    isActive?: boolean;
  };
  
  export type AuthState = {
    user: User | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
  };
  
  // Course types
  export type Course = {
    id: string;
    name: string;
    code: string;
    description: string;
    startDate: string;
    endDate: string;
    isVisible: boolean;
  };
  
  export type CourseWithDetails = Course & {
    assignments: Assignment[];
    resources: Resource[];
    forums: Forum[];
  };
  
  // Assignment types
  export type Assignment = {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    maxGrade: number;
    courseId?: string;
    courseName?: string;
  };
  
  export type AssignmentSubmission = {
    id: string;
    assignmentId: string;
    userId: string;
    submissionDate: string;
    fileUrl: string;
    grade?: number;
    feedback?: string;
    status: 'draft' | 'submitted' | 'graded';
  };
  
  // Resource types
  export type Resource = {
    id: string;
    name: string;
    description: string;
    fileUrl: string;
    uploadDate: string;
    courseId?: string;
    mimeType?: string;
    fileSize?: number;
  };
  
  // Forum types
  export type Forum = {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    courseId?: string;
  };
  
  export type ForumPost = {
    id: string;
    forumId: string;
    userId: string;
    userName: string;
    content: string;
    createdAt: string;
    updatedAt?: string;
    parentId?: string;
  };
  
  // Enrollment types
  export type Enrollment = {
    id: string;
    userId: string;
    courseId: string;
    role: string;
    enrollDate: string;
    status: 'active' | 'suspended' | 'completed';
  };
  
  // Grade types
  export type GradeItem = {
    id: string;
    courseId: string;
    name: string;
    description?: string;
    maxGrade: number;
    weight?: number;
    category?: string;
    dueDate?: string;
  };
  
  export type Grade = {
    id: string;
    userId: string;
    gradeItemId: string;
    value: number;
    feedback?: string;
    gradedDate: string;
    gradedBy: string;
  };
  
  // API response types
  export type ApiResponse<T> = {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
  };
  
  export type PaginatedResponse<T> = {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  
  // Form types
  export type LoginFormData = {
    username: string;
    password: string;
  };
  
  export type CourseFormData = {
    name: string;
    code: string;
    description: string;
    startDate: string;
    endDate: string;
    isVisible: boolean;
  };
  
  export type AssignmentFormData = {
    title: string;
    description: string;
    dueDate: string;
    maxGrade: number;
  };
  
  export type ResourceFormData = {
    name: string;
    description: string;
    file: File;
  };
  
  export type ForumFormData = {
    title: string;
    description: string;
  };
  
  export type UserFormData = {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password?: string;
    roleIds: number[];
  };