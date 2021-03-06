import React from "react";
import PropTypes from "prop-types";

import Router from "next/router";
import NProgress from "nprogress";

import StripeCheckout from "react-stripe-checkout";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import calcTotalPrice from "../lib/calcTotalPrice";
import ErrorMessage from "./ErrorMessage";
import User, { CURRENT_USER_QUERY } from "./User";

export const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

const totalItem = (cart) =>
  cart.reduce((prevCount, cartItem) => prevCount + cartItem.quantity, 0);

export const handleToken = (createOrder) => async ({ id }) => {
  NProgress.start();

  const res = await createOrder({
    variables: { token: id },
  }).catch((err) => alert(err.message));

  NProgress.done();

  Router.push({
    pathname: "/order",
    query: { id: res.data.createOrder.id },
  });
};

const TakeMyMoney = ({ children }) => {
  return (
    <User>
      {({ data, loading }) => {
        if (loading) return null;

        const me = data.me;
        return (
          <Mutation
            mutation={CREATE_ORDER_MUTATION}
            refetchQueries={[{ query: CURRENT_USER_QUERY }]}
          >
            {(createOrder, { loading, error }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <ErrorMessage error={error} />;

              return (
                <StripeCheckout
                  currency="JPY"
                  amount={calcTotalPrice(me.cart)}
                  name="Sick Fits"
                  description={`Order of ${totalItem(me.cart)} items!`}
                  image={
                    me.cart.length > 0 &&
                    me.cart[0].item &&
                    me.cart[0].item.image
                  }
                  stripeKey="pk_test_51I8z6ZLpYHsuoWLR6LI8KnoO4Vn9xDlJ8LA8FsqG85LAjNZKF3jNNfguCKURwMn3ZtoJwncdMxDn7njMJ3QlJ63b00ox1IhDLM"
                  email={me.email}
                  token={handleToken(createOrder)}
                >
                  {children}
                </StripeCheckout>
              );
            }}
          </Mutation>
        );
      }}
    </User>
  );
};

TakeMyMoney.propTypes = {};

export default TakeMyMoney;
