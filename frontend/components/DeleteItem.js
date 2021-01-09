import React from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import { ALL_ITEMS_QUERY } from "./Items";

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

const DeleteItem = ({ id, children }) => {
  const update = (cache, payload) => {
    // manually update the cache on client
    // 1. read the cache
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });

    // 2. filter the deleted item out of the page
    const items = data.items.filter((item) => item.id !== id);

    // 3. put the items back
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data: { ...data, items } });
  };

  return (
    <Mutation
      mutation={DELETE_ITEM_MUTATION}
      variables={{ id }}
      update={update}
    >
      {(deleteItem, { error, loading }) => (
        <button
          onClick={() => {
            if (confirm("Are you sure?")) {
              deleteItem().catch((err) => alert(err.message));
            }
          }}
        >
          {children}
        </button>
      )}
    </Mutation>
  );
};

DeleteItem.propTypes = {};

export default DeleteItem;
