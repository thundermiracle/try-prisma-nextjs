import React from "react";
import PropTypes from "prop-types";

import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import { CURRENT_USER_QUERY } from "./User";
import Form from "./styles/Form";
import ErrorMessage from "./ErrorMessage";

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`;

const Signin = (props) => {
  const [state, setState] = React.useState({
    email: "",
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
      mutation={SIGNIN_MUTATION}
      variables={state}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {(signin, { error, loading }) => {
        return (
          <Form
            method="post"
            onSubmit={(e) => {
              e.preventDefault();
              signin();
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign in</h2>
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

              <button type="submit">Sign In!</button>
            </fieldset>
          </Form>
        );
      }}
    </Mutation>
  );
};

Signin.propTypes = {};

export default Signin;
