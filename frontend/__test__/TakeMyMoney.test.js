import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import { MockedProvider } from "@apollo/react-testing";

import nProgress from "nprogress";
import Router from "next/router";
import {
  fakeCartItem,
  fakeOrder,
  fakeUser,
  waitForComponentToPaint,
} from "../lib/testUtils";
import { CURRENT_USER_QUERY } from "../components/User";
import TakeMyMoney, {
  CREATE_ORDER_MUTATION,
  handleToken,
} from "../components/TakeMyMoney";

const me = fakeUser();
const cartItem = fakeCartItem();
const order = fakeOrder();

const mocks = [
  {
    request: {
      query: CREATE_ORDER_MUTATION,
      variables: {
        token: "token from stripe",
      },
    },
    result: {
      data: {
        createOrder: {
          __typename: "Order",
          id: order.id,
          charge: order.charge,
          total: order.total,
          items: order.items,
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

describe("<TakeMyMoney />", () => {
  it("renders correctly", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <TakeMyMoney />
      </MockedProvider>,
    );

    await waitForComponentToPaint(wrapper);

    expect(toJSON(wrapper.find("ReactStripeCheckout"))).toMatchSnapshot();
  });

  it("handleToken test", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <TakeMyMoney />
      </MockedProvider>,
    );

    const createOrderMock = jest.fn().mockResolvedValue({
      data: { createOrder: { id: order.id } },
    });
    nProgress.start = jest.fn();
    Router.push = jest.fn();

    await waitForComponentToPaint(wrapper);

    await handleToken(createOrderMock)({ id: "token from stripe" });

    expect(nProgress.start).toHaveBeenCalled();
    expect(Router.push).toHaveBeenCalledWith({
      pathname: "/order",
      query: { id: order.id },
    });
  });
});
