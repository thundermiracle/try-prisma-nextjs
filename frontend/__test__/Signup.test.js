import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import { ApolloConsumer } from "react-apollo";
import { MockedProvider } from "@apollo/react-testing";

import {
  fakeUser,
  simInputChangeInWrapper,
  waitForComponentToPaint,
} from "../lib/testUtils";
import { CURRENT_USER_QUERY } from "../components/User";
import Signup, { SIGNUP_MUTATION } from "../components/Signup";

const me = fakeUser();
const mocks = [
  // signup success mutation mock
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        email: me.email,
        name: me.name,
        password: "mypassword",
      },
    },
    result: {
      data: {
        signup: {
          __typename: "User",
          id: me.id,
          email: me.email,
          name: me.name,
        },
      },
    },
  },

  // current user query mock
  {
    request: {
      query: CURRENT_USER_QUERY,
    },
    result: {
      data: {
        me: {
          __typename: "User",
          ...me,
        },
      },
    },
  },
];

describe("<Signup />", () => {
  it("renders correctly", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Signup />
      </MockedProvider>,
    );

    expect(toJSON(wrapper.find("form"))).toMatchSnapshot();
  });

  it("calls the mutation properly", async () => {
    let apolloClient;
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {(client) => {
            apolloClient = client;
            return <Signup />;
          }}
        </ApolloConsumer>
      </MockedProvider>,
    );

    await waitForComponentToPaint(wrapper);

    simInputChangeInWrapper(wrapper, "email", me.email);
    simInputChangeInWrapper(wrapper, "name", me.name);
    simInputChangeInWrapper(wrapper, "password", "mypassword");

    wrapper.find("form").simulate("submit");
    await waitForComponentToPaint(wrapper);

    // query the user out of the apollo client
    const user = await apolloClient.query({ query: CURRENT_USER_QUERY });
    expect(user.data.me).toMatchObject(me);
  });
});
