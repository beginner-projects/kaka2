'use client'

import React, { createContext, useContext, useEffect, useState } from "react";
import Web3 from "web3";
import btcbABI from "@/lib/btcbABI.json";
import { formatBitcoinBalanceInSats } from "@/utils/index";

interface PoolContextProps {
  bitcoinPoolBalance: number | null;
}

const PoolContext = createContext<PoolContextProps>({
  bitcoinPoolBalance: null,
});

export const usePool = () => useContext(PoolContext);

const fetchBitcoinBalance = async (
  web3: Web3,
  tokenAddress: string,
  walletAddress: string,
  setBalance: React.Dispatch<React.SetStateAction<number | null>>
) => {
  try {
    const tokenContract = new web3.eth.Contract(btcbABI, tokenAddress);
    const tokenBalanceScientific = await tokenContract.methods
      .balanceOf(walletAddress)
      .call();
    const tokenBalanceDecimal = formatBitcoinBalanceInSats(
      tokenBalanceScientific
    );
    setBalance(parseFloat(tokenBalanceDecimal.toString()));
  } catch (error) {
    console.error("Error fetching balance:", error);
  }
};

interface PoolProviderProps {
  children: React.ReactNode;
}

export const PoolProvider: React.FC<PoolProviderProps> = ({ children }) => {
  const [bitcoinPoolBalance, setBitcoinPoolBalance] = useState<number | null>(
    null
  );

  const walletAddress = "0x00000000f10D46931AEfBc7C5F4E02Dcf0814924";
  const tokenAddress = "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c";

  useEffect(() => {
    const fetchBalance = async () => {
      const web3 = new Web3(
        Web3.givenProvider || "https://bsc-dataseed.binance.org/"
      );
      await fetchBitcoinBalance(
        web3,
        tokenAddress,
        walletAddress,
        setBitcoinPoolBalance
      );
    };

    fetchBalance();

    const interval = setInterval(fetchBalance, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <PoolContext.Provider value={{ bitcoinPoolBalance }}>
      {children}
    </PoolContext.Provider>
  );
};

