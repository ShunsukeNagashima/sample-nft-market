import { useState, useEffect } from 'react';

import { AccountComponent } from './account';
import { INFT } from '../nft-list/types';
import { fetchOwnTokens, getWalletAddress } from '../../../utils/contractHelper';

export const Account = () => {
  const [ownedNfts, setOwnedNfts] = useState<INFT[]>([]);
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    const setup = async () => {
      const ownedItems = await fetchOwnTokens();
      if (!ownedItems) return;
      setOwnedNfts(ownedItems);

      const address = await getWalletAddress();
      setWalletAddress(address);
    };
    setup();
  }, [walletAddress]);

  return <AccountComponent ownedNfts={ownedNfts} walletAddress={walletAddress} />;
};
