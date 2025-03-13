// types.ts
export interface Course {
    id: number;
    category: number;
    fullname: string;
    shortname: string;
    idnumber?: string;
    summary?: string;
    format: string;
    visible: boolean;
    startdate: string; // ISO date string
    enddate?: string; // ISO date string
    timecreated: string; // ISO date string
    timemodified: string; // ISO date string
  }
  
  export interface Enrollment {
    id: number;
    enrolid: number;
    userid: number;
    courseid: number;
    status: number; // 0=active, 1=suspended
    timestart?: string; // ISO date string
    timeend?: string; // ISO date string
    timecreated: string; // ISO date string
    timemodified: string; // ISO date string
    course: Course;
  }
  
  export interface UserEnrollmentsResponse {
    userEnrollments: Enrollment[];
  }
  
  export interface UserEnrollmentsVars {
    userId: number;
  }
  
  export interface Asignaciones {
    allowsubmissionsfromdate: string;
    course: number;
    duedate: string;
    grade: number;
    id: number;
    intro: string;
    name: string;
    timemodified: string;
  }

  export interface CursoAsignacionResponse {
    assignments: {
      allowsubmissionsfromdate: string;
      course: number;
      duedate: string;
      grade: number;
      id: number;
      intro: string;
      name: string;
      timemodified: string;
    }[];
  }
  
  export interface CursoAsignacionesVars {
    courseId: number;
  }  


  export interface CursoSeccionesResponse {
    courseSections: {
      course: number;
      id: number;
      name: string;
      section: number;
      sequence: string;
      timemodified: string;
      visible: boolean;
      summary: string;
    }[];
  }
  
  export interface CursoSeccionesVars {
    courseId: number;
  } 

  export interface GetAsignacionResponse {
    assignment: {
      allowsubmissionsfromdate: string;
      course: number;
      duedate: string;
      grade: number;
      id: number;
      intro: string;
      name: string;
      timemodified: string;
    }; 
  }
  
  export interface GetAsignacionesVars {
    assignmentId: number;
  }