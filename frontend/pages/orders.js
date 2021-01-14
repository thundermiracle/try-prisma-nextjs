import React from "react";
import PropTypes from "prop-types";
import OrderList from "../components/OrderList";
import withSignIn from "../components/hoc/withSignIn";

const OrdersPage = (props) => {
  return <OrderList />;
};

OrdersPage.propTypes = {};

export default withSignIn(OrdersPage);
