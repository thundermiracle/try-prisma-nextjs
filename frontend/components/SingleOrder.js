import React from "react";
import PropTypes from "prop-types";

import Head from "next/head";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { format } from "date-fns";

import OrderStyles from "./styles/OrderStyles";
import formatMoney from "../lib/formatMoney";
import ErrorMessage from "./ErrorMessage";

const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    order(id: $id) {
      items {
        id
        title
        description
        image
        price
        quantity
      }
      user {
        id
      }
      id
      total
      charge
      createdAt
    }
  }
`;

const SingleOrder = ({ id }) => {
  return (
    <Query query={SINGLE_ORDER_QUERY} variables={{ id }}>
      {({ data, loading, error }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <ErrorMessage error={error} />;

        const order = data.order;
        return (
          <OrderStyles>
            <Head>
              <title>Sick Fits - Order {order.id}</title>
            </Head>
            <p>
              <span>Order ID:</span>
              <span>{id}</span>
            </p>
            <p>
              <span>Charge:</span>
              <span>{order.charge}</span>
            </p>
            <p>
              <span>Date:</span>
              <span>
                {format(new Date(order.createdAt), "yyyy/MM/dd hh:mm:ss")}
              </span>
            </p>
            <p>
              <span>Order Total:</span>
              <span>{formatMoney(order.total)}</span>
            </p>
            <p>
              <span>Item Count:</span>
              <span>{order.items.length}</span>
            </p>
            <div className="items">
              {order.items.map((item) => (
                <div className="order-item" key={item.id}>
                  <img src={item.image} alt={item.title} />
                  <div className="item-details">
                    <h2>{item.title}</h2>
                    <p>Qty: {item.quantity}</p>
                    <p>Each: {formatMoney(item.price)}</p>
                    <p>SubTotal: {formatMoney(item.price * item.quantity)}</p>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </OrderStyles>
        );
      }}
    </Query>
  );
};

SingleOrder.propTypes = {};

export default SingleOrder;
