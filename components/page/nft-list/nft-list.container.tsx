import { ethers } from 'ethers';
import { useState, useEffect, useCallback } from 'react';

import { INFT } from './types';
import { NFTListComponent } from './nft-list';
import { fetchMarketItems } from '../../../utils/contractHelper';

export const NFTList = () => {
  const [nfts, setNfts] = useState<INFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadNFTs = useCallback(async () => {
    const items = await fetchMarketItems();
    if (!items) return;
    setNfts(items);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    try {
      loadNFTs();
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  }, [loadNFTs]);

  return <NFTListComponent nfts={nfts} />;
};
