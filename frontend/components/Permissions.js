import React from "react";
import PropTypes from "prop-types";

import { Query } from "react-apollo";
import gql from "graphql-tag";

import Table from "./styles/Table";
import ErrorMessage from "./ErrorMessage";

import PermissionTableUser from "./PermissionTableUser";
import PossiblePermissions from "../lib/PossiblePermissions";

const ALL_PERMISSIONS_QUERY = gql`
  query ALL_PERMISSIONS_QUERY {
    users {
      id
      name
      email
      permissions
    }
  }
`;

const Permissions = (props) => {
  return (
    <Query query={ALL_PERMISSIONS_QUERY}>
      {({ data, loading, error }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <ErrorMessage error={error} />;

        return (
          <>
            <h2>Manage Permissions</h2>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  {PossiblePermissions.map((permissionName) => (
                    <th key={permissionName}>{permissionName}</th>
                  ))}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((user) => (
                  <PermissionTableUser key={user.id} {...user} />
                ))}
              </tbody>
            </Table>
          </>
        );
      }}
    </Query>
  );
};

Permissions.propTypes = {};

export default Permissions;
