import React from 'react'
import PropTypes from 'prop-types'
import SingleItem from '../components/SingleItem'

const ItemPage = ({ query }) => {
  return (
    <SingleItem id={query.id} />
  )
}

ItemPage.propTypes = {

}

export default ItemPage
