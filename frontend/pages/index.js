import Link from 'next/link';

import Items from '../components/Items'

const Home = ({ query }) => (
  <Items page={parseInt(query.page) || 1} />
);

export default Home;