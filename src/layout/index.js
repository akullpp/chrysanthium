import { React } from 'react'
import styled from '@emotion/styled'

import SEO from '../components/seo'
import Header from './header'
import Footer from './footer'

const Layout = styled.div`
  flex: 1 0 auto;
`

export default ({ title, path, excerpt, children }) => (
  <Layout>
    <SEO {...{ title, path, excerpt }} />
    <Header />
    {children}
    <Footer />
  </Layout>
)
