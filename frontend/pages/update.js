import Link from "next/link";
import UpdateItem from "../components/UpdateItem";
import withSignIn from "../components/hoc/withSignIn";

const Update = (props) => <UpdateItem id={props.query.id} />;

export default withSignIn(Update);
