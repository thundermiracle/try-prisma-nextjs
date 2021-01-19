import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import { ApolloConsumer } from "react-apollo";
import { MockedProvider } from "@apollo/react-testing";

import {
  fakeCartItem,
  fakeUser,
  waitForComponentToPaint,
} from "../lib/testUtils";
import { CURRENT_USER_QUERY } from "../components/User";
import AddToCart, { ADD_TO_CART_MUTATION } from "../components/AddToCart";

const me = fakeUser();
const cartItem = fakeCartItem();
const mocks = [
  {
    request: {
      query: ADD_TO_CART_MUTATION,
      variables: {
        id: cartItem.id,
      },
    },
    result: {
      data: {
        addToCart: {
          __typename: "CartItem",
          id: cartItem.id,
          quantity: cartItem.quantity,
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
          cart: [],
        },
      },
    },
  },

  // user after button clicked
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

describe("<AddToCart />", () => {
  it("render correctly", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <AddToCart id={cartItem.id} />
      </MockedProvider>,
    );

    await waitForComponentToPaint(wrapper);

    expect(toJSON(wrapper.find("button"))).toMatchSnapshot();
  });

  it("add an item to cart when clicked", async () => {
    let apolloClient;
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {(client) => {
            apolloClient = client;
            return <AddToCart id={cartItem.id} />;
          }}
        </ApolloConsumer>
      </MockedProvider>,
    );

    await waitForComponentToPaint(wrapper);

    // before add button clicked
    const befRes = await apolloClient.query({ query: CURRENT_USER_QUERY });
    expect(befRes.data.me.cart.length).toBe(0);

    // click addToCart button
    wrapper.find("button").simulate("click");

    await waitForComponentToPaint(wrapper);

    const aftRes = await apolloClient.query({ query: CURRENT_USER_QUERY });
    const [cartItemAfterClick] = aftRes.data.me.cart;
    expect(cartItemAfterClick.id).toBe(cartItem.id);
    expect(cartItemAfterClick.quantity).toBe(cartItem.quantity);
  });

  it("click to change text to adding to cart", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <AddToCart id={cartItem.id} />
      </MockedProvider>,
    );

    await waitForComponentToPaint(wrapper);

    // before click
    expect(wrapper.find("button").text()).toContain("Add to Cart");

    // after click & operating
    wrapper.find("button").simulate("click");
    expect(wrapper.find("button").text()).toContain("Adding to Cart");
  });
});
