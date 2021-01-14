import formatMoney from "../lib/formatMoney";

describe("formatMoney Function", () => {
  it("works", () => {
    expect(formatMoney(10)).toEqual("¥10");
    expect(formatMoney(100)).toEqual("¥100");
  });
});
