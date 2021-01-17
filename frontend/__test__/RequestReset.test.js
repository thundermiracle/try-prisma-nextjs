import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import { MockedProvider } from "@apollo/react-testing";

import { GraphQLError } from "graphql";
import { waitForComponentToPaint } from "../lib/testUtils";
import RequestReset, {
  REQUESTRESET_MUTATION,
} from "../components/RequestReset";

const CorrectEmail = "daniel@thundermiracle.com";
const IncorrectEmail = "test@thundermiracle.com";

const mockSuccess = [
  {
    request: {
      query: REQUESTRESET_MUTATION,
      variables: { email: CorrectEmail },
    },
    result: {
      data: {
        requestReset: {
          message: "success",
          __typename: "message",
        },
      },
    },
  },
];

const mockFailed = [
  {
    request: {
      query: REQUESTRESET_MUTATION,
      variables: { email: IncorrectEmail },
    },
    result: {
      data: {
        requestReset: {
          message: "failed",
          __typename: "message",
        },
      },
      errors: [new GraphQLError("GraphQL Error!")],
    },
  },
];

describe("<RequestReset />", () => {
  it("render properly", () => {
    const wrapper = mount(
      <MockedProvider mocks={mockSuccess}>
        <RequestReset />
      </MockedProvider>,
    );

    expect(toJSON(wrapper.find("Form"))).toMatchSnapshot();
  });

  it("success", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mockSuccess}>
        <RequestReset />
      </MockedProvider>,
    );

    // simulate inputting email
    wrapper.find("input").simulate("change", {
      target: { name: "email", value: CorrectEmail },
    });
    wrapper.find("form").simulate("submit");

    await waitForComponentToPaint(wrapper);

    expect(wrapper.find("fieldset p").text()).toContain("Check your email");
  });

  it("failed", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mockFailed}>
        <RequestReset />
      </MockedProvider>,
    );

    // simulate inputting email
    wrapper.find("input").simulate("change", {
      target: { name: "email", value: IncorrectEmail },
    });
    wrapper.find("form").simulate("submit");

    await waitForComponentToPaint(wrapper);

    expect(wrapper.find("DisplayError").text()).toContain("GraphQL Error!");
  });
});
