import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import styled from "styled-components";

import { Query } from "react-apollo";
import gql from "graphql-tag";
import { formatDistance } from "date-fns";
import formatMoney from "../lib/formatMoney";
import OrderItemStyles from "./styles/OrderItemStyles";

const ALL_ORDERS_QUERY = gql`
  query ALL_ORDERS_QUERY {
    orders(orderBy: createdAt_DESC) {
      items {
        id
        title
        description
        image
        price
        quantity
      }
      id
      total
      createdAt
    }
  }
`;

const OrderUL = styled.ul`
  display: grid;
  grid-gap: 4rem;
  grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
`;

const OrderList = (props) => {
  return (
    <Query query={ALL_ORDERS_QUERY}>
      {({ data, loading, error }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <ErrorMessage error={error} />;

        return (
          <>
            <OrderUL>
              {data.orders.map((order) => (
                <OrderItemStyles key={order.id}>
                  <Link href={{ pathname: "/order", query: { id: order.id } }}>
                    <a>
                      <div className="order-meta" style={{ marginBottom: 10 }}>
                        <p>
                          <span>Order ID:</span>
                          <span>{order.id}</span>
                        </p>
                        <p>
                          <span>{formatMoney(order.total)}</span>
                        </p>
                      </div>
                      <div className="order-meta">
                        <p>
                          {order.items.reduce(
                            (prevAmount, item) => prevAmount + item.quantity,
                            0,
                          )}{" "}
                          Items
                        </p>
                        <p>{order.items.length} Products</p>
                        <p>
                          {formatDistance(
                            new Date(order.createdAt),
                            new Date(),
                          )}
                        </p>
                      </div>
                    </a>
                  </Link>
                </OrderItemStyles>
              ))}
            </OrderUL>
          </>
        );
      }}
    </Query>
  );
};

OrderList.propTypes = {};

export default OrderList;
