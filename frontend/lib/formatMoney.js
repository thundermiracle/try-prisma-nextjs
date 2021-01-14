export default function (amount) {
  const options = { style: "currency", currency: "JPY" };

  const formatter = new Intl.NumberFormat("ja-JP", options);
  return formatter.format(amount);
}
