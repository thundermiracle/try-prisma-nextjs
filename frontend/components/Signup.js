import React from "react";
import PropTypes from "prop-types";

import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import Form from "./styles/Form";
import ErrorMessage from "./ErrorMessage";
import { CURRENT_USER_QUERY } from "./User";

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`;

const Signup = (props) => {
  const [state, setState] = React.useState({
    email: "",
    name: "",
    password: "",
  });

  const saveToState = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Mutation
      mutation={SIGNUP_MUTATION}
      variables={state}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {(signup, { error, loading }) => {
        return (
          <Form
            method="post"
            onSubmit={(e) => {
              e.preventDefault();
              signup();
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign up for an account!</h2>
              <ErrorMessage error={error} />
              <label htmlFor="email">
                Email
                <input
                  type="text"
                  name="email"
                  placeholder="email"
                  value={state.email}
                  onChange={saveToState}
                />
              </label>
              <label htmlFor="name">
                Name
                <input
                  type="text"
                  name="name"
                  placeholder="name"
                  value={state.name}
                  onChange={saveToState}
                />
              </label>
              <label htmlFor="password">
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  value={state.password}
                  onChange={saveToState}
                />
              </label>

              <button type="submit">Sign Up!</button>
            </fieldset>
          </Form>
        );
      }}
    </Mutation>
  );
};

Signup.propTypes = {};

export default Signup;
