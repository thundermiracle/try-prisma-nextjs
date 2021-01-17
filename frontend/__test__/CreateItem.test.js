import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import { MockedProvider } from "@apollo/react-testing";
import Router from "next/router";

import { fakeItem } from "../lib/testUtils";
import { waitForComponentToPaint } from "../lib/testUtils";
import CreateItem, { CREATE_ITEM_MUTATION } from "../components/CreateItem";

// mock fetch
const ThunderImage = "http://thundermiracle.com/thunder.jpg";
const ThunderLargeImage = "http://thundermiracle.com/thunder-large.jpg";
global.fetch = jest.fn().mockResolvedValue({
  json: () => ({
    secure_url: ThunderImage,
    eager: [{ secure_url: ThunderLargeImage }],
  }),
});

describe("<CreateItem />", () => {
  it("uploads a file when changed", async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>,
    );

    const updInput = wrapper.find('input[type="file"]');
    updInput.simulate("change", { target: { files: ["thunder.jpg"] } });

    await waitForComponentToPaint(wrapper);

    expect(wrapper.find("img").prop("src")).toBe(ThunderImage);
    expect(global.fetch).toHaveBeenCalled();
    global.fetch.mockReset();
  });

  it("create item when the form is submitted", async () => {
    const item = fakeItem();
    const mocks = [
      {
        request: {
          query: CREATE_ITEM_MUTATION,
          variables: {
            title: item.title,
            price: item.price,
            description: item.description,
            image: "",
            largeImage: "",
          },
        },
        result: {
          data: {
            createItem: {
              id: item.id,
              __typename: "ID",
            },
          },
        },
      },
    ];

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <CreateItem />
      </MockedProvider>,
    );

    // simulate inputting
    wrapper
      .find("#title")
      .simulate("change", { target: { name: "title", value: item.title } });
    wrapper.find("#price").simulate("change", {
      target: { name: "price", value: item.price, type: "number" },
    });
    wrapper.find("#description").simulate("change", {
      target: { name: "description", value: item.description },
    });

    // mock router
    Router.router = { push: jest.fn() };

    wrapper.find("form").simulate("submit");

    await waitForComponentToPaint(wrapper);

    expect(Router.router.push).toHaveBeenCalledWith({
      pathname: "/item",
      query: { id: item.id },
    });
  });
});
