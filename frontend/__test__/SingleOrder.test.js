import { mount } from "enzyme";
import { MockedProvider } from "@apollo/react-testing";

import { fakeOrder, waitForComponentToPaint } from "../lib/testUtils";
import SingleOrder, { SINGLE_ORDER_QUERY } from "../components/SingleOrder";

const order = fakeOrder();

const mocks = [
  {
    request: {
      query: SINGLE_ORDER_QUERY,
      variables: {
        id: order.id,
      },
    },
    result: {
      data: {
        order: {
          ...order,
          __typename: "Order",
        },
      },
    },
  },
];

describe("<SingleOrder />", () => {
  it("render correctly", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SingleOrder id={order.id} />
      </MockedProvider>,
    );

    await waitForComponentToPaint(wrapper);

    expect(
      wrapper
        .find('p[data-test="itemCount"]')
        .find('span[data-test="title"]')
        .text(),
    ).toContain("Item Count");
    expect(
      wrapper
        .find('p[data-test="itemCount"]')
        .find('span[data-test="data"]')
        .text(),
    ).toBe(order.items.length.toString());
  });
});
