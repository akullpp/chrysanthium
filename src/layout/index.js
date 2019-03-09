import { React } from 'react'
import styled from '@emotion/styled'

import SEO from '../components/seo'
import Header from './header'
import Footer from './footer'

const Layout = styled.div`
  flex: 1 0 auto;
`

export default ({ title, path, children }) => (
  <Layout>
    <SEO {...{ title, path }} />
    <Header />
    {children}
    <Footer />
  </Layout>
)
