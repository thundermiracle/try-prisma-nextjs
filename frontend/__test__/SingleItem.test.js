import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import SingleItem, { SINGLE_ITEMS_QUERY } from "../components/SingleItem";
import { MockedProvider } from "@apollo/react-testing";

import { fakeItem, waitForComponentToPaint } from "../lib/testUtils";

describe("<SingleItem />", () => {
  it("render with proper data", async () => {
    const mocks = [
      {
        request: { query: SINGLE_ITEMS_QUERY, variables: { id: "123" } },
        result: {
          data: {
            item: fakeItem(),
          },
        },
      },
    ];

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SingleItem id="123" />
      </MockedProvider>,
    );

    expect(wrapper.text()).toContain("Loading...");

    await waitForComponentToPaint(wrapper);

    expect(toJSON(wrapper.find("h2"))).toMatchSnapshot();
    expect(toJSON(wrapper.find("img"))).toMatchSnapshot();
    expect(toJSON(wrapper.find("p"))).toMatchSnapshot();
  });

  it("Not found", async () => {
    const mocks = [
      {
        request: { query: SINGLE_ITEMS_QUERY, variables: { id: "123" } },
        result: {
          errors: [{ message: "Items Not Found!" }],
        },
      },
    ];

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SingleItem id="123" />
      </MockedProvider>,
    );

    await waitForComponentToPaint(wrapper);

    expect(wrapper.find('[data-test="graphql-error"]').text()).toContain(
      "Items Not Found!",
    );
    expect(
      toJSON(wrapper.find('[data-test="graphql-error"]')),
    ).toMatchSnapshot();
  });
});
