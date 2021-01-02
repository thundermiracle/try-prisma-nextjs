import React from 'react'
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Head from 'next/head'
import Link from 'next/link'

import PaginationStyles from './styles/PaginationStyles'
import ErrorMessage from './ErrorMessage';

import { perPage } from '../config'

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

const Pagination = ({ page }) => (

  <Query query={PAGINATION_QUERY}>
    {
      ({ data, loading, error }) => {
        if (loading) return <p>loading...</p>;
        if (error) return <ErrorMessage error={error} />;

        const count = data.itemsConnection.aggregate.count;
        const pages = Math.ceil(count / perPage);

        return (
          <>
            <Head>
              <title>Sick Fits | Page {page} of {pages}</title>
            </Head>
            <PaginationStyles>
              <Link prefetch href={{ pathname: 'items', query: { page: page - 1 } }}>
                <a className="prev" aria-disabled={page <= 1}>← Prev</a>
              </Link>
              <p>Page {page} of {pages}</p>
              <p>{count} Items Total</p>
              <Link prefetch href={{ pathname: 'items', query: { page: page + 1 } }}>
                <a className="next" aria-disabled={page >= pages}>Next →</a>
              </Link>
            </PaginationStyles>
          </>
        )
      }
    }
  </Query>
);

export default Pagination;
