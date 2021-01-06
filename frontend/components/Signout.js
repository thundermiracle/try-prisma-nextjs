import React from "react";
import PropTypes from "prop-types";

import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import { CURRENT_USER_QUERY } from "./User";
import ErrorMessage from "./ErrorMessage";

const SIGNOUT_MUTATION = gql`
  mutation SIGNOUT_MUTATION {
    signout {
      message
    }
  }
`;

const Signout = () => (
  <Mutation
    mutation={SIGNOUT_MUTATION}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  >
    {(signout) => <button onClick={signout}>Sign out</button>}
  </Mutation>
);

Signout.propTypes = {};

export default Signout;
