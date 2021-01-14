import { shallow } from "enzyme";
import toJSON from "enzyme-to-json";
import ItemComponent from "../components/Item";

const fakeItem = {
  id: "123",
  title: "A cool city",
  price: 50000000,
  description: "This price is not negotiable",
  image: "city.jpg",
  largeImage: "largeCity.jpg",
};

// enzyme test
describe("by enzyme test", () => {
  it("renders and displays properly", () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);

    expect(wrapper.find("PriceTag").children().text()).toBe("¥50,000,000");
    expect(wrapper.find("Title a").text()).toBe(fakeItem.title);
    expect(wrapper.find("img").prop("src")).toBe(fakeItem.image);
  });

  it("renders out the buttons properly", () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);

    expect(wrapper.find(".buttonList").children()).toHaveLength(3);
    expect(wrapper.find(".buttonList").find("Link").exists()).toBeTruthy();
  });
});

describe("by snapshot", () => {
  it("matches snapshot", () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
