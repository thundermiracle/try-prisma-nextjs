import React from "react";
import PropTypes from "prop-types";

import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import SickButton from "./styles/SickButton";
import TdPermission from "./styles/TdPermission";
import PossiblePermissions from "../lib/PossiblePermissions";
import ErrorMessage from "./ErrorMessage";

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation updatePermissions($permissions: [Permission], $userId: ID!) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      name
      email
    }
  }
`;

const PermissionTableUser = ({ id, name, email, permissions = [] }) => {
  const [newPermissions, setNewPermissions] = React.useState(permissions);

  const handlePermissionChanged = (e) => {
    if (e.target.checked) {
      setNewPermissions([...newPermissions, e.target.value]);
    } else {
      setNewPermissions(newPermissions.filter((x) => x !== e.target.value));
    }
  };

  return (
    <Mutation
      mutation={UPDATE_PERMISSIONS_MUTATION}
      variables={{ userId: id, permissions: newPermissions }}
    >
      {(updatePermissions, { loading, error }) => (
        <>
          {error && (
            <tr>
              <td colspan="8">
                <ErrorMessage error={error} />
              </td>
            </tr>
          )}
          <tr>
            <td>{name}</td>
            <td>{email}</td>
            {PossiblePermissions.map((permissionName) => {
              const uniqueId = `${id}-permission-${permissionName}`;
              return (
                <TdPermission key={uniqueId}>
                  <label htmlFor={uniqueId}>
                    <input
                      id={uniqueId}
                      type="checkbox"
                      value={permissionName}
                      onChange={handlePermissionChanged}
                      checked={newPermissions.includes(permissionName)}
                    />
                  </label>
                </TdPermission>
              );
            })}
            <td>
              <SickButton
                type="button"
                onClick={updatePermissions}
                disabled={loading}
              >
                UPDAT{loading ? "ing" : "e"}
              </SickButton>
            </td>
          </tr>
        </>
      )}
    </Mutation>
  );
};

PermissionTableUser.propTypes = {};

export default PermissionTableUser;
