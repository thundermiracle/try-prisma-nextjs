import React from "react";
import PropTypes from "prop-types";
import withSignIn from "../components/hoc/withSignIn";
import SingleOrder from "../components/SingleOrder";

const OrderPage = ({ query }) => {
  return <SingleOrder id={query.id} />;
};

OrderPage.propTypes = {};

export default withSignIn(OrderPage);
