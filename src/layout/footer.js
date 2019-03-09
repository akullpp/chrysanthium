import React from 'react'
import { Link } from 'gatsby'
import styled from '@emotion/styled'

import Navigation from './navigation'

const Footer = styled(Navigation)`
  justify-content: center;
  margin-top: 10em;
  font-size: 0.75em;
  flex-shrink: 0;

  & a {
    color: #999;
  }
`

export default () => (
  <Footer>
    <ul>
      <li>
        <Link to="/privacy">Privacy</Link>
      </li>
      <li>
        <Link to="/legal">Legal</Link>
      </li>
    </ul>
  </Footer>
)
