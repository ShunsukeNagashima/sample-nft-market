import { useState, useEffect } from 'react';

import { AccountComponent } from './account';
import { INFT } from '../nft-list/types';
import { fetchOwnTokens, getOwnerAddress } from '../../../utils/contractHelper';

export const Account = () => {
  const [ownedNfts, setOwnedNfts] = useState<INFT[]>([]);
  const [ownerAddress, setOwnerAddress] = useState('');

  useEffect(() => {
    const setup = async () => {
      const items = await fetchOwnTokens();
      if (!items) return;
      setOwnedNfts(items);

      const address = await getOwnerAddress();
      setOwnerAddress(address);
    };
    setup();
  }, []);

  return <AccountComponent ownedNfts={ownedNfts} ownerAddress={ownerAddress} />;
};
