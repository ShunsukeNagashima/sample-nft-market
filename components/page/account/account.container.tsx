import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import { AccountComponent } from './account';
import { INFT } from '../nft-list/types';
import { fetchOwnTokens, getWalletAddress, fetchMarketItems } from '../../../utils/contractHelper';

export const Account = () => {
  const [ownedNfts, setOwnedNfts] = useState<INFT[]>([]);
  const [walletAddress, setWalletAddress] = useState('');
  const [onSaleNfts, setOnSaleNfts] = useState<INFT[]>([]);

  useEffect(() => {
    const setup = async () => {
      const ownedItems = await fetchOwnTokens();
      if (!ownedItems) return;
      setOwnedNfts(ownedItems);

      const allItems = await fetchMarketItems();
      const onSaleItems = allItems.filter((item) => item.seller == walletAddress && item.owner == ethers.constants.AddressZero);
      setOnSaleNfts(onSaleItems);

      const address = await getWalletAddress();
      setWalletAddress(address);
    };
    setup();
  }, [walletAddress]);

  return <AccountComponent ownedNfts={ownedNfts} walletAddress={walletAddress} onSaleNfts={onSaleNfts} />;
};
