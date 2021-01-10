import React from "react";
import PropTypes from "prop-types";

import { Query } from "react-apollo";
import gql from "graphql-tag";
import style from "styled-components";
import ErrorMessage from "./ErrorMessage";
import Item from "./Item";
import Pagination from './Pagination'
import { perPage } from "../config";

export const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY($skip: Int = 0, $first: Int = ${perPage}) {
    items(skip: $skip, first: $first, orderBy: createdAt_DESC) {
      id
      title
      price
      description
      image
      largeImage
    }
  }
`;

const Center = style.div`
  text-align: center;
`;

const ItemList = style.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${(props) => props.theme.maxWidth};
  margin: 0 auto;
`;

const Items = ({ page }) => {
  return (
    <Center>
      <Pagination page={page} />
      <Query
        query={ALL_ITEMS_QUERY}
        fetchPolicy="network-only"
        variables={{
          skip: (page - 1) * perPage,
          first: perPage
        }
        }>
        {({ data, error, loading }) => {
          if (loading) return <p>loading...</p>;
          if (error) return <ErrorMessage error={error} />;

          return (
            <ItemList>
              {data.items.map((item) => (
                <Item item={item} key={item.id} />
              ))}
            </ItemList>
          );
        }}
      </Query>
      <Pagination page={page} />
    </Center>
  );
};

Items.propTypes = {};

export default Items;
