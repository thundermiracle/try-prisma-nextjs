import React from "react";
import PropTypes from "prop-types";

import styled from "styled-components";
import formatMoney from "../lib/formatMoney";
import RemoveFromCart from "./RemoveFromCart";

const CartItemStyles = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${(props) => props.theme.lightgrey};
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 10px;
  }
  h3,
  p {
    margin: 0;
  }
`;

const CartItem = ({ data: { id, item, quantity } }) => {
  const { image, title, price } = item;

  return (
    <CartItemStyles>
      <img width="100" height="70" src={image} alt={title} />
      <div className="cart-item-details">
        <h3>{title}</h3>
        <p>
          {formatMoney(price * quantity)}
          {"-"}
          <em>
            {quantity} &times; {formatMoney(price)}
          </em>
        </p>
      </div>
      <RemoveFromCart id={id} />
    </CartItemStyles>
  );
};

CartItem.propTypes = {};

export default CartItem;
