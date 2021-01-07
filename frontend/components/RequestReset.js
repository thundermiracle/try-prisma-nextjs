import React from "react";
import PropTypes from "prop-types";

import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import { CURRENT_USER_QUERY } from "./User";
import Form from "./styles/Form";
import ErrorMessage from "./ErrorMessage";

const REQUESTRESET_MUTATION = gql`
  mutation REQUESTRESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

const Requestreset = (props) => {
  const [state, setState] = React.useState({
    email: "",
  });

  const saveToState = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Mutation mutation={REQUESTRESET_MUTATION} variables={state}>
      {(requestreset, { error, loading, called }) => {
        return (
          <Form
            method="post"
            onSubmit={(e) => {
              e.preventDefault();
              requestreset();
              setState({ email: "" });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Request Password Reset</h2>
              <ErrorMessage error={error} />
              {!error && !loading && called && (
                <p>Success! Check your email for a reset link!</p>
              )}
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

              <button type="submit">Request!</button>
            </fieldset>
          </Form>
        );
      }}
    </Mutation>
  );
};

Requestreset.propTypes = {};

export default Requestreset;
