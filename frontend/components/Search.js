import React from "react";
import PropTypes from "prop-types";

import Downshift, { resetIdCounter } from "downshift";
import Router from "next/router";
import { ApolloConsumer } from "react-apollo";
import gql from "graphql-tag";
import debounce from "lodash.debounce";

import { DropDown, DropDownItem, SearchStyles } from "./styles/DropDown";

const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($searchTerm: String!) {
    items(
      where: {
        OR: [
          { title_contains: $searchTerm }
          { description_contains: $searchTerm }
        ]
      }
    ) {
      id
      image
      title
    }
  }
`;

const routeToItem = (item) => {
  Router.push({
    pathname: "/item",
    query: {
      id: item.id,
    },
  });
};

const AutoComplete = (props) => {
  const [searchResult, setSearchResult] = React.useState({
    items: [],
    loading: false,
  });

  resetIdCounter();

  const debouncedSearch = React.useCallback(
    debounce(async (client, searchTerm) => {
      const res = await client.query({
        query: SEARCH_ITEMS_QUERY,
        variables: { searchTerm },
      });

      setSearchResult({
        items: res.data.items,
        loading: false,
      });
    }, 350),
    [],
  );

  const handleSearchTermChange = (client) => async (e) => {
    setSearchResult({
      ...searchResult,
      loading: true,
    });

    await debouncedSearch(client, e.target.value);
  };

  return (
    <SearchStyles>
      <Downshift
        onChange={routeToItem}
        itemToString={(item) => (item === null ? "" : item.title)}
      >
        {({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue,
          highlightedIndex,
        }) => (
          <div>
            <ApolloConsumer>
              {(client) => (
                <input
                  type="search"
                  {...getInputProps({
                    type: "search",
                    id: "search",
                    placeholder: "Search for an item",
                    className: searchResult.loading ? "loading" : "",
                    onChange: handleSearchTermChange(client),
                  })}
                />
              )}
            </ApolloConsumer>
            {isOpen && (
              <DropDown>
                {searchResult.items.map((item, index) => (
                  <DropDownItem
                    key={item.id}
                    {...getItemProps({
                      item,
                    })}
                    highlighted={index === highlightedIndex}
                  >
                    <img width="50" src={item.image} alt={item.title} />
                    {item.title}
                  </DropDownItem>
                ))}
                {searchResult.items.length === 0 && !searchResult.loading && (
                  <DropDownItem>NOTHING FOUND FOR [{inputValue}]</DropDownItem>
                )}
              </DropDown>
            )}
          </div>
        )}
      </Downshift>
    </SearchStyles>
  );
};

AutoComplete.propTypes = {};

export default AutoComplete;
