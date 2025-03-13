// api.ts
import { CursoAsignacionesVars, CursoAsignacionResponse, CursoSeccionesResponse, CursoSeccionesVars, GetAsignacionesVars, GetAsignacionResponse, UserEnrollmentsResponse, UserEnrollmentsVars } from '@/app/types';
// import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

// // Configura el cliente de Apollo con la URL de tu backend GraphQL
// export const client = new ApolloClient({
//   uri: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/graphql',
//   cache: new InMemoryCache(),
// });

import { ApolloClient, InMemoryCache, gql, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

// Manejo de errores global
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.error(`[Network error]: ${networkError}`);
});

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/graphql',
});

// Configuración mejorada de caché
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // Configuración para asignaciones individuales
        assignment: {
          read(_, { args, toReference }) {
            return toReference({
              __typename: 'Assignment',
              id: args?.assignmentId,
            });
          }
        },
        // Configuración para listas de asignaciones
        assignments: {
          merge(existing = [], incoming) {
            return [...incoming];
          }
        }
      }
    }
  }
});

// Crear el cliente de Apollo
export const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
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

export const GET_ASIGNACION = gql`
  query GetAssignment($assignmentId: Int!) {
    assignment(assignmentId: $assignmentId) {
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

export const getAsignacion = async (assignmentId: number) => {
  try {
    const { data } = await client.query<GetAsignacionResponse, GetAsignacionesVars>({
      query: GET_ASIGNACION,
      variables: { assignmentId },
      fetchPolicy: 'network-only', // Para obtener datos actualizados
    });
    return data.assignment;
  } catch (error) {
    console.error('Error fetching user enrollments:', error);
    throw error;
  }
};