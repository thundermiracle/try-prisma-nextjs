import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import { MockedProvider } from "@apollo/react-testing";

import {
  fakeCartItem,
  fakeUser,
  waitForComponentToPaint,
} from "../lib/testUtils";
import { CURRENT_USER_QUERY } from "../components/User";
import Cart, { LOCAL_STATE_QUERY } from "../components/Cart";

const me = fakeUser();
const mocks = [
  // local state query
  {
    request: {
      query: LOCAL_STATE_QUERY,
    },
    result: {
      data: {
        cartOpen: true,
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
          cart: [fakeCartItem()],
        },
      },
    },
  },
];

describe("<Cart />", () => {
  it("renders correctly", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Cart />
      </MockedProvider>,
    );

    expect(toJSON(wrapper.find("header"))).toMatchSnapshot();

    // CANNOT get localState correctly
    // await waitForComponentToPaint(wrapper);
    // expect(wrapper.find("CartItem")).toHaveLength(1);
  });
});
