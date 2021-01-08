import React from "react";
import PropTypes from "prop-types";

import { Query } from "react-apollo";
import { CURRENT_USER_QUERY } from "../User";
import SignIn from "../Signin";

const SignInWrapper = (BaseComponent) => {
  const withSignIn = (props) => {
    return (
      <Query query={CURRENT_USER_QUERY}>
        {({ data, loading }) => {
          if (loading) return <p>Loading...</p>;
          if (!data.me) {
            return (
              <>
                <p>Please Sign In Before Continuing</p>
                <SignIn />
              </>
            );
          }

          return <BaseComponent {...props} user={data.me} />;
        }}
      </Query>
    );
  };

  return withSignIn;
};

export default SignInWrapper;
