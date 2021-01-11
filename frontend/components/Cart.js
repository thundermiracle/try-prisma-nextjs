import React from "react";
import PropTypes from "prop-types";

import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import User from "./User";
import CartItem from "./CartItem";
import CartStyles from "./styles/CartStyles";
import Supreme from "./styles/Supreme";
import CloseButton from "./styles/CloseButton";
import SickButton from "./styles/SickButton";

import calcTotalPrice from "../lib/calcTotalPrice";
import formatMoney from "../lib/formatMoney";

export const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client
  }
`;

export const TOGGLE_CART_MUTATION = gql`
  mutation {
    toggleCart @client
  }
`;

const Cart = (props) => {
  return (
    <User>
      {({ data: userData }) => {
        if (!userData || !userData.me) {
          return null;
        }
        const me = userData.me;

        return (
          <Mutation mutation={TOGGLE_CART_MUTATION}>
            {(toggleCart) => (
              <Query query={LOCAL_STATE_QUERY}>
                {({ data }) => (
                  <CartStyles open={data.cartOpen}>
                    <header>
                      <CloseButton title="close" onClick={toggleCart}>
                        &times;
                      </CloseButton>
                      <Supreme>{me.name}'s Cart</Supreme>
                      <p>You Have {me.cart.length} Items in your cart.</p>
                    </header>
                    <ul style={{ overflow: "auto" }}>
                      {me.cart.map((cartItem) => (
                        <CartItem key={cartItem.id} data={cartItem} />
                      ))}
                    </ul>
                    <footer>
                      <p>{formatMoney(calcTotalPrice(me.cart))}</p>
                      <SickButton>Checkout</SickButton>
                    </footer>
                  </CartStyles>
                )}
              </Query>
            )}
          </Mutation>
        );
      }}
    </User>
  );
};

Cart.propTypes = {};

export default Cart;
