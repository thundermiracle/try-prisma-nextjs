import React from 'react'
import PropTypes from 'prop-types'

import Router from 'next/router';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import ErrorMessage from './ErrorMessage';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      price
      description
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!,
    $title: String,
    $description: String,
    $price: Int,
  ) {
    updateItem(
      id: $id,
      title: $title,
      description: $description,
      price: $price,
    ) {
      id
      title
      description
      price
    }
  }
`;

const UpdateItem = props => {
  const [ state, setState ] = React.useState({
  })

  const handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value): value;

    setState({
      ...state,
      [name]: val,
    });
  }

  const handleUpdateItem = async (e, updateItemMutation) => {
    e.preventDefault();
    console.log(props.id);
    const res = await updateItemMutation({
      variables: {
        id: props.id,
        ...state,
      }
    });
  }

  return (
    <Query query={SINGLE_ITEM_QUERY} variables={{id: props.id}}>
      {
        ({data, loading}) => {
          if (loading) return <p>loading...</p>;
          if (!data.item) return <p>No Data Found for ID: {props.id}</p>;

          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={state}>
              {(updateItem, { loading, error }) => {
                return (
                  <Form
                    onSubmit={e => handleUpdateItem(e, updateItem)}
                  >
                    <ErrorMessage error={error} />
                    <fieldset disabled={loading} aria-busy={loading}>
                      {/* <label htmlFor="file">
                        Image
                        <input
                          type="file"
                          id="file"
                          name="file"
                          placeholder="Upload an image"
                          required
                          defaultValue={data.item.file}
                          onChange={uploadFile}
                        />
                      </label> */}

                      <label htmlFor="title">
                        Title
                        <input
                          type="text"
                          id="title"
                          name="title"
                          placeholder="Title"
                          required
                          defaultValue={data.item.title}
                          onChange={handleChange}
                        />
                      </label>

                      <label htmlFor="price">
                        Price
                        <input
                          type="number"
                          id="price"
                          name="price"
                          placeholder="Price"
                          required
                          defaultValue={data.item.price}
                          onChange={handleChange}
                        />
                      </label>

                      <label htmlFor="description">
                        Description
                        <textarea
                          id="description"
                          name="description"
                          placeholder="Enter a Description"
                          required
                          defaultValue={data.item.description}
                          onChange={handleChange}
                        />
                      </label>

                      <button type="submit">Save Changes</button>
                    </fieldset>
                  </Form>
                );
              }}
            </Mutation>
          );
        }
      }
    </Query>
    );
}

UpdateItem.propTypes = {

}

export { UpdateItem as default, UPDATE_ITEM_MUTATION}