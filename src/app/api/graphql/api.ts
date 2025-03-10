// api.ts
import { CursoAsignacionesVars, CursoAsignacionResponse, CursoSeccionesResponse, CursoSeccionesVars, UserEnrollmentsResponse, UserEnrollmentsVars } from '@/app/types';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

// Configura el cliente de Apollo con la URL de tu backend GraphQL
export const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/graphql',
  cache: new InMemoryCache(),
});

// Consulta GraphQL para obtener las inscripciones de un usuario
export const GET_USER_ENROLLMENTS = gql`
  query GetUserEnrollments($userId: Int!) {
    userEnrollments(userId: $userId) {
      id
      enrolid
      userid
      courseid
      status
      timestart
      timeend
      timecreated
      timemodified
      course {
        id
        fullname
        shortname
        summary
        visible
        startdate
        enddate
        format
      }
    }
  }
`;

// Función para obtener las inscripciones de un usuario
export const getUserEnrollments = async (userId: number) => {
  try {
    const { data } = await client.query<UserEnrollmentsResponse, UserEnrollmentsVars>({
      query: GET_USER_ENROLLMENTS,
      variables: { userId },
      fetchPolicy: 'network-only', // Para obtener datos actualizados
    });
    return data.userEnrollments;
  } catch (error) {
    console.error('Error fetching user enrollments:', error);
    throw error;
  }
};

export const LOGIN_MUTATION = gql`
mutation login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    id
    username
    firstname
    lastname
    email
    confirmed
    deleted
    suspended
  }
}
`;

export const login = async (email: string, password: string) => {
  try {
    const { data } = await client.mutate({
      mutation: LOGIN_MUTATION,
      variables: { email, password },
    });
    return data.login;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const GET_CURSO_ASIGNACIONES = gql`
  query GetCursoAsignaciones($courseId: Int!) {
    assignments(courseId: $courseId) {
      allowsubmissionsfromdate
      course
      duedate
      grade
      id
      intro
      name
      timemodified
    }
  }
`;

export const getCursoAsignaciones = async (courseId: number) => {
  try {
    const { data } = await client.query<CursoAsignacionResponse, CursoAsignacionesVars>({
      query: GET_CURSO_ASIGNACIONES,
      variables: { courseId },
      fetchPolicy: 'network-only', // Para obtener datos actualizados
    });
    return data.assignments;
  } catch (error) {
    console.error('Error fetching user enrollments:', error);
    throw error;
  }
};


export const GET_CURSO_SECCIONES = gql`
  query GetCursoAsignaciones($courseId: Int!) {
    courseSections(courseId: $courseId) {
      course
      id
      name
      section
      sequence
      timemodified
      visible
      summary
    }
  }
`;

export const getCursoSecciones = async (courseId: number) => {
  try {
    const { data } = await client.query<CursoSeccionesResponse, CursoSeccionesVars>({
      query: GET_CURSO_SECCIONES,
      variables: { courseId },
      fetchPolicy: 'network-only', // Para obtener datos actualizados
    });
    return data.courseSections;
  } catch (error) {
    console.error('Error fetching user enrollments:', error);
    throw error;
  }
};