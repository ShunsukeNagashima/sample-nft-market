import { ethers } from 'ethers';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { createContainer } from 'unstated-next';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

const providerOptions = {
  walletconnect: {
    display: {
      logo: '/walletconnect-logo.svg',
    },
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.NEXT_PUBLIC_INFURA_KEY,
    },
  },
};

const useWeb3Container = () => {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  const [web3Modal, setWeb3Modal] = useState<Web3Modal>();
  const router = useRouter();

  const connectWallet = useCallback(async () => {
    try {
      const connection = await web3Modal?.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const accounts = await provider.listAccounts();
      setProvider(provider);
      if (accounts) setAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  }, [web3Modal]);

  const refreshState = useCallback(() => {
    setAccount('');
  }, []);

  const disconnect = useCallback(async () => {
    await web3Modal?.clearCachedProvider();
    refreshState();
    router.push('/');
  }, [refreshState, web3Modal, router]);

  useEffect(() => {
    const web3Modal = new Web3Modal({ cacheProvider: true, providerOptions });
    setWeb3Modal(web3Modal);
  }, []);

  useEffect(() => {
    if (web3Modal?.cachedProvider) {
      connectWallet();
    }
  }, [connectWallet, web3Modal]);

  return { connectWallet, account, disconnect };
};

export const Web3Container = createContainer(useWeb3Container);
