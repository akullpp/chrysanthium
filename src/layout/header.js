import React from 'react'
import { Link } from 'gatsby'

import Navigation from './navigation'

export default () => (
  <Navigation>
    <ul>
      <li>
        <Link to="/">Blog</Link>
      </li>
      <li>
        <Link to="/senshi">Senshi</Link>
      </li>
      <li>
        <Link to="/about">About</Link>
      </li>
    </ul>
  </Navigation>
)
