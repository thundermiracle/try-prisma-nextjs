import React from "react";
import PropTypes from "prop-types";

import { Mutation } from "react-apollo";
import styled from "styled-components";
import gql from "graphql-tag";

import { CURRENT_USER_QUERY } from "./User";

export const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${(props) => props.theme.red};
    cursor: pointer;
  }
`;

const RemoveFromCart = ({ id }) => {
  const refreshCacheAfterUpdate = (cache, payload) => {
    // 1. read the cache
    const data = cache.readQuery({ query: CURRENT_USER_QUERY });
    if (!data || !data.me) {
      // GraphQL error
      return;
    }

    // 2. filter the deleted item out of the page
    const cart = data.me.cart.filter((item) => item.id !== id);

    // 3. put the items back
    cache.writeQuery({
      query: CURRENT_USER_QUERY,
      data: {
        ...data,
        me: {
          ...data.me,
          cart,
        },
      },
    });
  };

  return (
    <Mutation
      mutation={REMOVE_FROM_CART_MUTATION}
      variables={{ id }}
      update={refreshCacheAfterUpdate}
      optimisticResponse={{
        __typename: "Mutation",
        removeFromCart: {
          __typename: "CartItem",
          id,
        },
      }}
    >
      {(removeFromCart, { error, loading }) => {
        return (
          <BigButton
            title="Delete Item"
            disabled={loading}
            onClick={() => removeFromCart().catch((err) => alert(err.message))}
          >
            &times;
          </BigButton>
        );
      }}
    </Mutation>
  );
};

RemoveFromCart.propTypes = {};

export default RemoveFromCart;
