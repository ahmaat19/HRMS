import Navigation from './Navigation'
import Head from 'next/head'
import Canvas from './Canvas'

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>HRMS</title>
        <meta property='og:title' content='HRMS' key='title' />
      </Head>
      <Navigation />
      <Canvas />
      <div className='container'>{children}</div>
    </>
  )
}
