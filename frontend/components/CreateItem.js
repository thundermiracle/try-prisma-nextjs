import React from "react";
import PropTypes from "prop-types";

import Router from "next/router";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import ErrorMessage from "./ErrorMessage";

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      image: $image
      largeImage: $largeImage
      price: $price
    ) {
      id
    }
  }
`;

const CreateItem = (props) => {
  const [state, setState] = React.useState({
    title: "",
    description: "",
    image: "",
    largeImage: "",
    price: 0,
  });

  const handleChange = (e) => {
    const { name, type, value } = e.target;
    const val = type === "number" ? parseFloat(value) || 0 : value;

    setState({
      ...state,
      [name]: val,
    });
  };

  const uploadFile = async (e) => {
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "sickfits");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/thundermiracle/image/upload",
      {
        method: "POST",
        body: data,
      },
    );

    const file = await res.json();
    console.log("image uploaded");
    setState({
      ...state,
      image: file.secure_url,
      largeImage: file.eager[0].secure_url,
    });
  };

  return (
    <Mutation mutation={CREATE_ITEM_MUTATION} variables={state}>
      {(createItem, { loading, error, called, data }) => {
        return (
          <Form
            onSubmit={async (e) => {
              e.preventDefault();
              const res = await createItem();

              Router.push({
                pathname: "/item",
                query: {
                  id: res.data.createItem.id,
                },
              });
            }}
          >
            <ErrorMessage error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="file">
                Image
                <input
                  type="file"
                  id="file"
                  name="file"
                  placeholder="Upload an image"
                  value={state.file}
                  onChange={uploadFile}
                />
                {state.image && <img src={state.image} alt="Upload preview" />}
              </label>

              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  required
                  value={state.title}
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
                  value={state.price}
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
                  value={state.description}
                  onChange={handleChange}
                />
              </label>

              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        );
      }}
    </Mutation>
  );
};

CreateItem.propTypes = {};

export { CreateItem as default, CREATE_ITEM_MUTATION };
