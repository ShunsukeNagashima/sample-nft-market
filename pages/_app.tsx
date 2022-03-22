import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Layout } from '../components/ui/layout';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '../theme';

import { Web3Container } from '../container/web3-contaner';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Web3Container.Provider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Web3Container.Provider>
    </ChakraProvider>
  );
}

export default MyApp
