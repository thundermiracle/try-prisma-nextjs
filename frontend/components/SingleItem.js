import React from 'react'
import PropTypes from 'prop-types'

import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import styled from 'styled-components'
import Head from 'next/head'

import ErrorMessage from './ErrorMessage'

const SingleItemStyle = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.bs};
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 800px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .details {
    margin: 3rem;
    font-size: 2rem;
  }
`;

export const SINGLE_ITEMS_QUERY = gql`
  query SINGLE_ITEMS_QUERY ($id: ID!) {
    item (where: { id: $id }) {
      id
      title
      price
      description
      image
      largeImage
    }
  } 
`;

const SingleItem = ({ id }) => {
  return (
    <Query query={SINGLE_ITEMS_QUERY} variables={{ id }}>
      {({ data, error, loading }) => {
        if (loading) return <p>loading...</p>;
        if (error) return <ErrorMessage error={error} />;

        const item = data.item;
        if (!item) return <p>No Item Found!</p>;

        return (
          <>
            <Head><title>Sick fits | {item.title}</title></Head>
            <SingleItemStyle>
              <img src={item.largeImage} alt={item.title} />
              <div className="details">
                <h2>Viewing {item.title}</h2>
                <p>{item.description}</p>
              </div>
            </SingleItemStyle>
          </>
        )
      }}
    </Query>
  )
}

SingleItem.propTypes = {

}

export default SingleItem
