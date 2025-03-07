// app/providers/ApolloProvider.tsx
'use client';

import { ApolloClient, ApolloProvider as Provider, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { PropsWithChildren, useMemo } from 'react';

export function ApolloProvider({ children }: PropsWithChildren) {
  // Error handling link para mejor debugging
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    if (networkError) console.error(`[Network error]: ${networkError}`);
  });

  // HTTP link para conectar a tu backend - Importante: notar el /graphql al final
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/graphql',
    credentials: 'same-origin'
  });

  // Crear el cliente Apollo usando useMemo para evitar recreaciones innecesarias
  const client = useMemo(() => {
    return new ApolloClient({
      link: from([errorLink, httpLink]),
      cache: new InMemoryCache(),
      connectToDevTools: process.env.NODE_ENV !== 'production',
      defaultOptions: {
        query: {
          fetchPolicy: 'cache-and-network',
          errorPolicy: 'all',
        },
      },
    });
  }, []);

  return <Provider client={client}>{children}</Provider>;
}
