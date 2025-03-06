// lib/api/graphql.ts
import { GraphQLClient, gql } from 'graphql-request';

// Create GraphQL client
const graphqlClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:8000/graphql',
  {
    headers: () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      return token ? { Authorization: `Bearer ${token}` } : {};
    },
  }
);

// GraphQL queries
export const QUERIES = {
  // Course queries
  GET_ALL_COURSES: gql`
    query GetAllCourses {
      courses {
        id
        name
        code
        description
        startDate
        endDate
        isVisible
      }
    }
  `,
  
  GET_COURSE_BY_ID: gql`
    query GetCourseById($id: ID!) {
      course(id: $id) {
        id
        name
        code
        description
        startDate
        endDate
        isVisible
      }
    }
  `,
  
  GET_COURSE_WITH_DETAILS: gql`
    query GetCourseWithDetails($id: ID!) {
      course(id: $id) {
        id
        name
        code
        description
        startDate
        endDate
        isVisible
        assignments {
          id
          title
          description
          dueDate
          maxGrade
        }
        resources {
          id
          name
          description
          fileUrl
          uploadDate
        }
        forums {
          id
          title
          description
        }
      }
    }
  `,
  
  // Assignment queries
  GET_COURSE_ASSIGNMENTS: gql`
    query GetCourseAssignments($courseId: ID!) {
      courseAssignments(courseId: $courseId) {
        id
        title
        description
        dueDate
        maxGrade
      }
    }
  `,
  
  // Resource queries
  GET_COURSE_RESOURCES: gql`
    query GetCourseResources($courseId: ID!) {
      courseResources(courseId: $courseId) {
        id
        name
        description
        fileUrl
        uploadDate
      }
    }
  `,
  
  // Forum queries
  GET_COURSE_FORUMS: gql`
    query GetCourseForums($courseId: ID!) {
      courseForums(courseId: $courseId) {
        id
        title
        description
        createdAt
      }
    }
  `,
  
  // User queries
  GET_ALL_USERS: gql`
    query GetAllUsers {
      users {
        id
        username
        email
        firstName
        lastName
        isActive
        roles {
          id
          name
        }
      }
    }
  `,
  
  GET_USER_BY_ID: gql`
    query GetUserById($id: ID!) {
      user(id: $id) {
        id
        username
        email
        firstName
        lastName
        isActive
        roles {
          id
          name
        }
      }
    }
  `,
  
  // Role queries
  GET_ALL_ROLES: gql`
    query GetAllRoles {
      roles {
        id
        name
        shortname
        description
      }
    }
  `,
};

// GraphQL mutations
export const MUTATIONS = {
  // Course mutations
  CREATE_COURSE: gql`
    mutation CreateCourse($input: CourseInput!) {
      createCourse(input: $input) {
        id
        name
        code
        description
      }
    }
  `,
  
  UPDATE_COURSE: gql`
    mutation UpdateCourse($id: ID!, $input: CourseInput!) {
      updateCourse(id: $id, input: $input) {
        id
        name
        code
        description
      }
    }
  `,
  
  DELETE_COURSE: gql`
    mutation DeleteCourse($id: ID!) {
      deleteCourse(id: $id) {
        success
        message
      }
    }
  `,
  
  // Assignment mutations
  CREATE_ASSIGNMENT: gql`
    mutation CreateAssignment($courseId: ID!, $input: AssignmentInput!) {
      createAssignment(courseId: $courseId, input: $input) {
        id
        title
        description
      }
    }
  `,
  
  // Forum mutations
  CREATE_FORUM: gql`
    mutation CreateForum($courseId: ID!, $input: ForumInput!) {
      createForum(courseId: $courseId, input: $input) {
        id
        title
        description
      }
    }
  `,
  
  // User mutations
  CREATE_USER: gql`
    mutation CreateUser($input: UserInput!) {
      createUser(input: $input) {
        id
        username
        email
      }
    }
  `,
  
  UPDATE_USER: gql`
    mutation UpdateUser($id: ID!, $input: UserInput!) {
      updateUser(id: $id, input: $input) {
        id
        username
        email
      }
    }
  `,
  
  DELETE_USER: gql`
    mutation DeleteUser($id: ID!) {
      deleteUser(id: $id) {
        success
        message
      }
    }
  `,
};

// Custom hook-like functions for GraphQL operations
export const graphqlAPI = {
  // Course operations
  getAllCourses: async () => {
    try {
      const data = await graphqlClient.request(QUERIES.GET_ALL_COURSES);
      return data.courses;
    } catch (error) {
      throw error;
    }
  },
  
  getCourseById: async (id: string) => {
    try {
      const data = await graphqlClient.request(QUERIES.GET_COURSE_BY_ID, { id });
      return data.course;
    } catch (error) {
      throw error;
    }
  },
  
  getCourseWithDetails: async (id: string) => {
    try {
      const data = await graphqlClient.request(QUERIES.GET_COURSE_WITH_DETAILS, { id });
      return data.course;
    } catch (error) {
      throw error;
    }
  },
  
  createCourse: async (input: any) => {
    try {
      const data = await graphqlClient.request(MUTATIONS.CREATE_COURSE, { input });
      return data.createCourse;
    } catch (error) {
      throw error;
    }
  },
  
  updateCourse: async (id: string, input: any) => {
    try {
      const data = await graphqlClient.request(MUTATIONS.UPDATE_COURSE, { id, input });
      return data.updateCourse;
    } catch (error) {
      throw error;
    }
  },
  
  deleteCourse: async (id: string) => {
    try {
      const data = await graphqlClient.request(MUTATIONS.DELETE_COURSE, { id });
      return data.deleteCourse;
    } catch (error) {
      throw error;
    }
  },
  
  // Assignment operations
  getCourseAssignments: async (courseId: string) => {
    try {
      const data = await graphqlClient.request(QUERIES.GET_COURSE_ASSIGNMENTS, { courseId });
      return data.courseAssignments;
    } catch (error) {
      throw error;
    }
  },
  
  createAssignment: async (courseId: string, input: any) => {
    try {
      const data = await graphqlClient.request(MUTATIONS.CREATE_ASSIGNMENT, { courseId, input });
      return data.createAssignment;
    } catch (error) {
      throw error;
    }
  },
  
  // Resource operations
  getCourseResources: async (courseId: string) => {
    try {
      const data = await graphqlClient.request(QUERIES.GET_COURSE_RESOURCES, { courseId });
      return data.courseResources;
    } catch (error) {
      throw error;
    }
  },
  
  // Forum operations
  getCourseForums: async (courseId: string) => {
    try {
      const data = await graphqlClient.request(QUERIES.GET_COURSE_FORUMS, { courseId });
      return data.courseForums;
    } catch (error) {
      throw error;
    }
  },
  
  createForum: async (courseId: string, input: any) => {
    try {
      const data = await graphqlClient.request(MUTATIONS.CREATE_FORUM, { courseId, input });
      return data.createForum;
    } catch (error) {
      throw error;
    }
  },
  
  // User operations
  getAllUsers: async () => {
    try {
      const data = await graphqlClient.request(QUERIES.GET_ALL_USERS);
      return data.users;
    } catch (error) {
      throw error;
    }
  },
  
  getUserById: async (id: string) => {
    try {
      const data = await graphqlClient.request(QUERIES.GET_USER_BY_ID, { id });
      return data.user;
    } catch (error) {
      throw error;
    }
  },
  
  createUser: async (input: any) => {
    try {
      const data = await graphqlClient.request(MUTATIONS.CREATE_USER, { input });
      return data.createUser;
    } catch (error) {
      throw error;
    }
  },
  
  updateUser: async (id: string, input: any) => {
    try {
      const data = await graphqlClient.request(MUTATIONS.UPDATE_USER, { id, input });
      return data.updateUser;
    } catch (error) {
      throw error;
    }
  },
  
  deleteUser: async (id: string) => {
    try {
      const data = await graphqlClient.request(MUTATIONS.DELETE_USER, { id });
      return data.deleteUser;
    } catch (error) {
      throw error;
    }
  },
  
  // Role operations
  getAllRoles: async () => {
    try {
      const data = await graphqlClient.request(QUERIES.GET_ALL_ROLES);
      return data.roles;
    } catch (error) {
      throw error;
    }
  },
};

export default graphqlClient;