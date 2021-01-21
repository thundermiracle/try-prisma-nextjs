import withApollo from "next-with-apollo";
import ApolloClient from "apollo-boost";
import { endpoint, prodEndpoint } from "../config";

import { LOCAL_STATE_QUERY } from "../components/Cart";

function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === "development" ? endpoint : prodEndpoint,
    request: (operation) => {
      operation.setContext({
        fetchOptions: {
          credentials: "include",
        },
        headers,
      });
    },
    // client local state
    clientState: {
      resolvers: {
        Mutation: {
          toggleCart(_, args, { cache }) {
            // read the cartOpen from cache
            const cachedData = cache.readQuery({ query: LOCAL_STATE_QUERY });

            // toggle cartOpen state
            const data = {
              data: { ...cachedData, cartOpen: !cachedData.cartOpen },
            };
            cache.writeData(data);

            // return
            return data;
          },
        },
      },
      defaults: {
        cartOpen: false,
      },
    },
  });
}

export default withApollo(createClient);
