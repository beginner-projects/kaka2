'use client'

import { useEffect, useState } from "react";
import Web3 from "web3";
import FLTABI from "@/lib/FLTABI.json";
// import { usePool } from "@/context/useBitcoinContext";
import { useMetaMask } from "@/context/useMetaMask";
import { formatBalanceEight } from "@/utils";

const Home: React.FC = () => {
    // const { bitcoinPoolBalance } = usePool();
    const { wallet } = useMetaMask();
    const [usersFLTBalance, setUsersFLTBalance] = useState<number>(0);

    // stake
    // const myStake: number = (usersFLTBalance / 100000000) * 100;

    // my income
    // const myNextPayout: number = (bitcoinPoolBalance * myStake) / 100;

    // fetch SPD token balance
    const tokenAddress: string = "0x965F527D9159dCe6288a2219DB51fc6Eef120dD1";

    useEffect(() => {
        const fetchFLTBalance = async () => {
            try {
                const web3 = new Web3(
                    Web3.givenProvider || "https://bsc-dataseed.binance.org/"
                );
                const tokenContract = new web3.eth.Contract(FLTABI, tokenAddress);
                const tokenBalanceScientific: string = await tokenContract.methods
                    .balanceOf(wallet.accounts[0])
                    .call();
                const formattedTokenBalanceScientific: string = formatBalanceEight(
                    tokenBalanceScientific
                );
                setUsersFLTBalance(parseFloat(formattedTokenBalanceScientific));
            } catch (error) {
                console.error("Error fetching balance:", error);
            }
        };

        const updateUserFltBalance = () => {
            if (!wallet.accounts[0]) {
                setUsersFLTBalance(0);
            }
        };
        updateUserFltBalance();
        fetchFLTBalance();

        const interval = setInterval(fetchFLTBalance, 15000);

        return () => clearInterval(interval);
    }, [wallet.accounts[0], tokenAddress]);

    return (
        <>
            {usersFLTBalance > 0
                ? `${usersFLTBalance.toFixed(2)} SPD`
                : "00 SPD"}
        </>

    );
};

export default Home;
