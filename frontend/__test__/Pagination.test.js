import { mount } from "enzyme";
import Pagination, { PAGINATION_QUERY } from "../components/Pagination";
import { MockedProvider } from "@apollo/react-testing";

import { waitForComponentToPaint } from "../lib/testUtils";

const makeMocksFor = (count = 1) => [
  {
    request: { query: PAGINATION_QUERY },
    result: {
      data: {
        itemsConnection: {
          __typename: "aggregate",
          aggregate: {
            __typename: "count",
            count,
          },
        },
      },
    },
  },
];

describe("<Pagination />", () => {
  it("display a loading message", async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(1)}>
        <Pagination page={1} />
      </MockedProvider>,
    );

    expect(wrapper.find("Query p").text()).toBe("Loading...");
  });

  it("renders pagination for 18 items", async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={1} />
      </MockedProvider>,
    );

    await waitForComponentToPaint(wrapper);

    expect(wrapper.find(".totalPages").text()).toContain("of 5");
    expect(wrapper.find(".totalCount").text()).toContain("18 Items");
  });

  it("disable prev button on first page", async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={1} />
      </MockedProvider>,
    );

    await waitForComponentToPaint(wrapper);

    expect(wrapper.find("a.prev").prop("aria-disabled")).toBe(true);
    expect(wrapper.find("a.next").prop("aria-disabled")).toBe(false);
  });

  it("disable next button on last page", async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={5} />
      </MockedProvider>,
    );

    await waitForComponentToPaint(wrapper);

    expect(wrapper.find("a.prev").prop("aria-disabled")).toBe(false);
    expect(wrapper.find("a.next").prop("aria-disabled")).toBe(true);
  });

  it("disable nothing on a middle page", async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={2} />
      </MockedProvider>,
    );

    await waitForComponentToPaint(wrapper);

    expect(wrapper.find("a.prev").prop("aria-disabled")).toBe(false);
    expect(wrapper.find("a.next").prop("aria-disabled")).toBe(false);
  });
});
