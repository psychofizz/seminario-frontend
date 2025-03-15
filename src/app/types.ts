export interface Course {
    id: number;
    category: number;
    fullname: string;
    shortname: string;
    idnumber?: string;
    summary?: string;
    format: string;
    visible: boolean;
    startdate: string; 
    enddate?: string;
    timecreated: string; 
    timemodified: string; 
  }
  
  export interface Enrollment {
    id: number;
    enrolid: number;
    userid: number;
    courseid: number;
    status: number; // 0=active, 1=suspended
    timestart?: string; 
    timeend?: string; 
    timecreated: string; 
    timemodified: string; 
    course: Course;
  }
  
  export interface UserEnrollmentsResponse {
    userEnrollments: Enrollment[];
  }
  
  export interface UserEnrollmentsVars {
    userId: number;
  }
  
  export interface Asignacion {
    allowsubmissionsfromdate: string;
    course: number;
    duedate: string;
    grade: number;
    id: number;
    section: number;
    intro: string;
    name: string;
    timemodified: string;
  }

  export interface CursoAsignacionResponse {
    assignments: Asignacion[];
  }
  
  export interface CursoAsignacionesVars {
    courseId: number;
    sectionId: number;
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
      section: number;
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