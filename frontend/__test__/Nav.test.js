import { mount } from "enzyme";
import Nav from "../components/Nav";
import { CURRENT_USER_QUERY } from "../components/User";
import { MockedProvider } from "@apollo/react-testing";

import { fakeUser, waitForComponentToPaint } from "../lib/testUtils";

const NotSignedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: null } },
  },
];

const SignedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: fakeUser() } },
  },
];

describe("<Nav />", () => {
  it("render partial menus to logged out users", async () => {
    const wrapper = mount(
      <MockedProvider mocks={NotSignedInMocks}>
        <Nav />
      </MockedProvider>,
    );

    await waitForComponentToPaint(wrapper);

    expect(wrapper.find("User Query").children().length).toBe(1);
    expect(wrapper.find("User Query").text()).toContain("Signin");
  });

  it("render all menus to logged in users", async () => {
    const wrapper = mount(
      <MockedProvider mocks={SignedInMocks}>
        <Nav />
      </MockedProvider>,
    );

    await waitForComponentToPaint(wrapper);

    expect(wrapper.find("User Query").children().length).toBe(5);
    expect(wrapper.find("User Query").text()).toContain("Sign out");
  });
});
