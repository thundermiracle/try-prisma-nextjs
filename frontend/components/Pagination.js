import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Head from "next/head";
import Link from "next/link";

import PaginationStyles from "./styles/PaginationStyles";
import ErrorMessage from "./ErrorMessage";

import { perPage } from "../config";

export const PAGINATION_QUERY = gql`
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
    {({ data, loading, error }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <ErrorMessage error={error} />;

      const count = data.itemsConnection.aggregate.count;
      const pages = Math.ceil(count / perPage);

      return (
        <>
          <Head>
            <title>
              Sick Fits | Page {page} of {pages}
            </title>
          </Head>
          <PaginationStyles>
            <Link href={{ pathname: "items", query: { page: page - 1 } }}>
              <a className="prev" aria-disabled={page <= 1}>
                ← Prev
              </a>
            </Link>
            <p className="totalPages">
              Page {page} of {pages}
            </p>
            <p className="totalCount">{count} Items Total</p>
            <Link href={{ pathname: "items", query: { page: page + 1 } }}>
              <a className="next" aria-disabled={page >= pages}>
                Next →
              </a>
            </Link>
          </PaginationStyles>
        </>
      );
    }}
  </Query>
);

export default Pagination;
