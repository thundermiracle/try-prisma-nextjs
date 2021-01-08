import Link from "next/link";
import CreateItem from "../components/CreateItem";

import withSignIn from "../components/hoc/withSignIn";

const Sell = (props) => (
  <div>
    <CreateItem />
  </div>
);

export default withSignIn(Sell);
