import React from "react";
import PropTypes from "prop-types";

import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const ADD_TO_CART_MUTATION = gql`
  mutation addToCart($id: ID!) {
    addToCart(id: $id) {
      id
      quantity
    }
  }
`;

const AddToCart = ({ id }) => {
  return (
    <Mutation mutation={ADD_TO_CART_MUTATION} variables={{ id }}>
      {(addToCart) => <button onClick={addToCart}>Add to Cart🛒</button>}
    </Mutation>
  );
};

AddToCart.propTypes = {};

export default AddToCart;
