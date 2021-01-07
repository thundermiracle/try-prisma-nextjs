import React from "react";

import styled from "styled-components";

import ResetPassword from "../components/ResetPassword";

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const ResetPage = ({ query }) => {
  return (
    <Columns>
      <ResetPassword resetToken={query.resetToken} />
    </Columns>
  );
};

export default ResetPage;
