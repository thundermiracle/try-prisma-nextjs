import { shallow, mount } from "enzyme";
import toJSON from "enzyme-to-json";
import CartCount from "../components/CartCount";

describe("CartCount by snapshot", () => {
  it("renders", () => {
    shallow(<CartCount count={10} />);
  });

  it("snapshot", () => {
    const wrapper = shallow(<CartCount count={10} />);

    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it("update via props", () => {
    const wrapper = shallow(<CartCount count={15} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
    wrapper.setProps({ count: 10 });
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
