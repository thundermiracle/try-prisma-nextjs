import React from 'react'
import PropTypes from 'prop-types'

import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import style from 'styled-components';
import Item from './Item';

export const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY {
    items {
      id
      title
      price
      description
      image
      largeImage
    }
  }
`;

const Center = style.div`
  text-align: center;
`;

const ItemList = style.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`;

const Items = props => {
  return (
    <div>
      Items
      <Query query={ALL_ITEMS_QUERY}>
        {
          ({data, error, loading}) => {
            if (loading) return <p>loading...</p>;
            if (error) return <p>Error: {error.message}</p>;

            return (
              <ItemList>
                {
                  data.items.map(item => <Item item={item} key={item.id} />)
                }
              </ItemList>
            )
          }
        }
      </Query>
    </div>
  )
}

Items.propTypes = {

}

export default Items;
