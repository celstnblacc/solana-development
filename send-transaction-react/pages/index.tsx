import { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import WalletContextProvider from '../components/WalletContextProvider'
import { AppBar } from '../components/AppBar'
import { BalanceDisplay } from '../components/BalanceDisplay'
import { SendTransaction } from '../components/SendTransaction'
import { PingButton } from '../components/PingButton'
import Head from 'next/head'

const Home: NextPage = (props) => {

  return (
    <div className={styles.App}>
      <Head>
        <title>Send SOL (devnet)</title>
        <meta
          name="description"
          content="Send SOL (devnet)"
        />
      </Head>
      <WalletContextProvider>
        <AppBar />
        <div className={styles.AppBody}>
          {/* <PingButton /> */}
          <BalanceDisplay/>
          <SendTransaction/>
        </div>
      </WalletContextProvider >
    </div>
  );
}

export default Home;