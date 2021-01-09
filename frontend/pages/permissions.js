import Link from "next/link";

import Permissions from "../components/Permissions";
import withSignIn from "../components/hoc/withSignIn";

const PermissionsPage = (props) => <Permissions />;

export default withSignIn(PermissionsPage);
