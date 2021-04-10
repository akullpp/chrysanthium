import React from 'react'
import { Link } from 'gatsby'
import { ThemeToggler } from 'gatsby-plugin-dark-mode'

import Navigation from './navigation'

const toggleIcon = ({ theme = 'dark', toggleTheme }) => {
  const isDark = theme === 'dark'
  const next = isDark ? 'light' : 'dark'
  const toggle = () => toggleTheme(next)
  return <img className="clickable" src={`${next}.svg`} alt="Toggle theme" onClick={toggle} />
}

export default () => (
  <Navigation>
    <ul>
      <li>
        <Link to="/">Blog</Link>
      </li>

      <li>
        <Link to="/about">About</Link>
      </li>

      <li>
        <ThemeToggler>{toggleIcon}</ThemeToggler>
      </li>
    </ul>
  </Navigation>
)
