import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link';

import Title from './styles/Title';
import ItemStyles from './styles/ItemStyles';
import PriceTag from './styles/PriceTag';
import formatMoney from '../lib/formatMoney';
import DeleteItem from './DeleteItem';

const Item = ({ item: { id, title, price, description, image } }) => {
  return (
    <ItemStyles>
      {image && <img src={image} alt={title} />}
      <Title>
        <Link
          href={{
            pathname: "/item",
            query: { id }
          }}
        >
          <a>{title}</a>
        </Link>
      </Title>
      <PriceTag>{formatMoney(price)}</PriceTag>
      <p>{description}</p>

      <div className="buttonList">
        <Link href={{ pathname: "update", query: { id } }}>
          <button><a>Edit</a></button>
        </Link>
        <button>Add to Cart</button>
        <DeleteItem id={id}>Delete this item</DeleteItem>
      </div>
    </ItemStyles>
  );
};

Item.propTypes = {
  item: PropTypes.object.isRequired,
}

export default Item
