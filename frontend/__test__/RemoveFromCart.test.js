import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import { ApolloConsumer } from "react-apollo";
import { MockedProvider } from "@apollo/react-testing";
import { GraphQLError } from "graphql";

import {
  fakeCartItem,
  fakeUser,
  waitForComponentToPaint,
} from "../lib/testUtils";
import { CURRENT_USER_QUERY } from "../components/User";
import RemoveFromCart, {
  REMOVE_FROM_CART_MUTATION,
} from "../components/RemoveFromCart";

const me = fakeUser();
const cartItem = fakeCartItem();
const mocks = [
  {
    request: {
      query: REMOVE_FROM_CART_MUTATION,
      variables: {
        id: cartItem.id,
      },
    },
    result: {
      data: {
        removeFromCart: {
          __typename: "CartItem",
          id: cartItem.id,
        },
      },
    },
  },

  // user before button clicked
  {
    request: {
      query: CURRENT_USER_QUERY,
    },
    result: {
      data: {
        me: {
          __typename: "User",
          ...me,
          cart: [cartItem],
        },
      },
    },
  },
];

const mocksError = [
  {
    request: {
      query: REMOVE_FROM_CART_MUTATION,
      variables: {
        id: cartItem.id,
      },
    },
    result: {
      data: {
        removeFromCart: {
          __typename: "message",
          message: "failed",
        },
      },
      errors: [new GraphQLError("GraphQL Error!")],
    },
  },

  // user before button clicked
  {
    request: {
      query: CURRENT_USER_QUERY,
    },
    result: {
      data: {
        me: {
          __typename: "User",
          ...me,
          cart: [cartItem],
        },
      },
    },
  },
];

describe("<RemoveFromCart />", () => {
  it("renders correctly", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <RemoveFromCart id={cartItem.id} />
      </MockedProvider>,
    );

    await waitForComponentToPaint(wrapper);
    expect(toJSON(wrapper.find("button"))).toMatchSnapshot();
  });

  it("remove item from cart", async () => {
    let apolloClient;
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {(client) => {
            apolloClient = client;
            return <RemoveFromCart id={cartItem.id} />;
          }}
        </ApolloConsumer>
      </MockedProvider>,
    );

    await waitForComponentToPaint(wrapper);

    // before click remove button
    const befRes = await apolloClient.query({ query: CURRENT_USER_QUERY });
    const [befCartItem] = befRes.data.me.cart;
    expect(befCartItem.quantity).toBe(cartItem.quantity);

    // click remove button
    wrapper.find("button").simulate("click");
    await waitForComponentToPaint(wrapper);

    // after click remove button
    const aftRes = await apolloClient.query({ query: CURRENT_USER_QUERY });
    expect(aftRes.data.me.cart.length).toBe(0);
  });

  it("remove item error", async () => {
    global.alert = jest.fn();

    const wrapper = mount(
      <MockedProvider mocks={mocksError}>
        <RemoveFromCart id={cartItem.id} />
      </MockedProvider>,
    );

    // render
    await waitForComponentToPaint(wrapper);

    // click
    wrapper.find("button").simulate("click");

    // re-render
    await waitForComponentToPaint(wrapper);

    expect(global.alert.mock.calls[0][0]).toContain("GraphQL Error!");

    global.alert.mockReset();
  });
});
