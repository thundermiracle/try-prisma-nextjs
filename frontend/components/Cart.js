import React from "react";
import PropTypes from "prop-types";

import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { adopt } from "react-adopt";
import User from "./User";
import CartItem from "./CartItem";
import CartStyles from "./styles/CartStyles";
import Supreme from "./styles/Supreme";
import CloseButton from "./styles/CloseButton";
import SickButton from "./styles/SickButton";

import calcTotalPrice from "../lib/calcTotalPrice";
import formatMoney from "../lib/formatMoney";
import TakeMyMoney from "./TakeMyMoney";

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

const Composed = adopt({
  user: ({ render }) => <User>{render}</User>,
  toggleCart: ({ render }) => (
    <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>
  ),
  localState: ({ render }) => <Query query={LOCAL_STATE_QUERY}>{render}</Query>,
});

const Cart = (props) => {
  return (
    <Composed>
      {({ user, toggleCart, localState }) => {
        if (!user.data || !user.data.me) {
          return null;
        }
        const me = user.data.me;

        return (
          <CartStyles open={localState.data.cartOpen}>
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
              {me.cart.length > 0 ? (
                <TakeMyMoney>
                  <SickButton>Checkout</SickButton>
                </TakeMyMoney>
              ) : null}
            </footer>
          </CartStyles>
        );
      }}
    </Composed>
  );
};

Cart.propTypes = {};

export default Cart;
