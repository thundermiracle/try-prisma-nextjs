import React from "react";
import PropTypes from "prop-types";

import Router from "next/router";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import { CURRENT_USER_QUERY } from "./User";
import Form from "./styles/Form";
import ErrorMessage from "./ErrorMessage";

const RESETPASSWORD_MUTATION = gql`
  mutation RESETPASSWORD_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      name
    }
  }
`;

const ResetPassword = ({ resetToken }) => {
  const [state, setState] = React.useState({
    password: "",
    confirmPassword: "",
  });

  const saveToState = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Mutation
      mutation={RESETPASSWORD_MUTATION}
      variables={{ ...state, resetToken }}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {(resetPassword, { error, loading, called }) => {
        return (
          <Form
            method="post"
            onSubmit={async (e) => {
              e.preventDefault();
              await resetPassword();
              setState({ password: "", confirmPassword: "" });
              Router.push("/me");
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Reset Your Password</h2>
              <ErrorMessage error={error} />
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

              <label htmlFor="confirmPassword">
                Confirm Password
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={state.confirmPassword}
                  onChange={saveToState}
                />
              </label>

              <button type="submit">Reset!</button>
            </fieldset>
          </Form>
        );
      }}
    </Mutation>
  );
};

ResetPassword.propTypes = {};

export default ResetPassword;
