import { mount } from "enzyme";
import withSignIn from "../components/hoc/withSignIn";
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

const PageNeedLogin = () => <div>Yes!You're logged in!</div>;
const PageNeedLoginWithCheck = withSignIn(PageNeedLogin);

describe("hoc -- withSignIn", () => {
  it("render sign in dialog to logged out users", async () => {
    const wrapper = mount(
      <MockedProvider mocks={NotSignedInMocks}>
        <PageNeedLoginWithCheck />
      </MockedProvider>,
    );

    await waitForComponentToPaint(wrapper);

    expect(wrapper.find("PageNeedLogin").exists()).toBe(false);
    expect(wrapper.find("Signin").exists()).toBe(true);
  });

  it("render PageNeedLogin to logged in users", async () => {
    const wrapper = mount(
      <MockedProvider mocks={SignedInMocks}>
        <PageNeedLoginWithCheck />
      </MockedProvider>,
    );

    await waitForComponentToPaint(wrapper);

    expect(wrapper.find("Signin").exists()).toBe(false);
    expect(wrapper.find("PageNeedLogin").exists()).toBe(true);
  });
});
