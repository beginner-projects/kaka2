'use client'

import { useMetaMask } from "@/context/useMetaMask"; // Update the import path
import { usePool } from "@/context/useBitcoinContext";
import Image from "next/image";
import styles from './page.module.css';
import { formatAddress } from "@/utils/index.js";
import SPDBalance from '@/components/SPDBalance/SPDBalance'


export default function Home() {
    const { bitcoinPoolBalance } = usePool();
    const { wallet, connectMetaMask } = useMetaMask();
   

    // Function to format balance with commas remains unchanged
    const formatBalanceWithCommas = (bitcoinPoolBalance: number | null) => {
        if (bitcoinPoolBalance !== null) {
            return bitcoinPoolBalance.toLocaleString();
        } else {
            return "00"; // Or whatever default value you prefer
        }
    };

    // Determine the length of bitcoinPoolBalance
    const balanceLength = bitcoinPoolBalance ? bitcoinPoolBalance.toString().length : 0;
    

    return (
        <main className="overflow-hidden">
            <div className="text-white">
                {/* Render the connect wallet button if not connected */}
                {!wallet.accounts.length && (
                    <h4 onClick={connectMetaMask}>
                        <Image className={styles.walletIcon} src="/wallet.svg" alt="wallet" width={90} height={90} />
                        <span className={styles.connectWallet}>Connect</span>
                        <h3 className={styles.spdBalanceDisplay}>
                            <SPDBalance />
                        </h3>
                    </h4>
                )}

                {/* Render the connected wallet address if connected */}
                {wallet.accounts.length > 0 && (
                    <h4>
                        <Image className={styles.walletIcon} src="/wallet.svg" alt="wallet" width={90} height={90} />
                        {/* addressAfterConnecting */}
                        <p className={styles.connectWallet}>{formatAddress(wallet.accounts[0])}</p>
                        <h3 className={styles.spdBalanceDisplay}>
                            <SPDBalance />
                        </h3>
                    </h4>
                )}

                {/* Render other UI elements */}
                <Image  className={styles.flashIcon} src="/flash.svg" alt="logo" width={50} height={50} />
            </div>

            {/* Render bitcoin pool balance */}
            <p className={styles.subTagBitcoinPool}>Bitcoin Pool (sats)</p>
            {/* Retain existing h1 styling and add length-based class */}
            <h1 className={`${styles.poolBalance} ${styles[`poolBalance${balanceLength}`]}`}>
                {formatBalanceWithCommas(bitcoinPoolBalance)}   
            </h1>

            {/* Render background images */}
            <Image className={styles.bgCircle} priority src="/darkmodebg.svg" alt="bg" width={450} height={50} />
            <Image className={styles.bgCircle768} priority src="/768bg.svg" alt="bg" width={768} height={656} />
            <Image className={styles.bgCircle1024} priority src="/1024bg.svg" alt="bg" width={1024} height={1024} />
            <Image className={styles.bgCircle1440} priority src="/1440bg.svg" alt="bg" width={1440} height={1440} />
        </main>
    );
}







