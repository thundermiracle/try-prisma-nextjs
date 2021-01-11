import Link from "next/link";
import { Mutation } from "react-apollo";
import { TOGGLE_CART_MUTATION } from "./Cart";
import NavStyles from "./styles/NavStyles";
import User from "./User";
import ErrorMessage from "./ErrorMessage";
import Signout from "./Signout";
import CartCount from "./CartCount";

const Nav = () => (
  <NavStyles>
    <Link href="/items">
      <a>Shop</a>
    </Link>
    <User>
      {({ data, error, loading }) => {
        if (loading) return null;
        if (error) return <ErrorMessage error={error} />;
        if (!data || !data.me)
          return (
            <Link href="/signup">
              <a>Signin</a>
            </Link>
          );

        return (
          <>
            <Link href="/sell">
              <a>Sell</a>
            </Link>
            <Link href="/orders">
              <a>Orders</a>
            </Link>
            <Link href="/me">
              <a>Account</a>
            </Link>
            <Signout />
            <Mutation mutation={TOGGLE_CART_MUTATION}>
              {(toggleCart) => (
                <button onClick={toggleCart}>
                  My Cart
                  <CartCount
                    count={data.me.cart.reduce((prevCount, { quantity }) => {
                      return prevCount + quantity;
                    }, 0)}
                  />
                </button>
              )}
            </Mutation>
          </>
        );
      }}
    </User>
  </NavStyles>
);

export default Nav;
