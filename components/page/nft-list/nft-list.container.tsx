import { ethers } from 'ethers';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';

import { nftaddress, nftmarketaddress } from '../../../config';
import Market from '../../../artifacts/contracts/Market.sol/Market.json';
import NFT from '../../../artifacts/contracts/NFT.sol/NFT.json';
import { INFT } from './types';
import { NFTListComponent } from './nft-list';

export const NFTList = () => {
  const [nfts, setNfts] = useState<INFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadNFTs = useCallback(async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const nftContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider);
    const data = await marketContract.fetchMarketTokens();

    const items = await Promise.all(
      data.map(async (i: any) => {
        const tokenUri = await nftContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        const priceInEther = ethers.utils.formatUnits(i.price.toString(), 'ether');
        const item = {
          itemId: i.itemId.toNumber(),
          tokenId: i.tokenId.toNumber(),
          priceInEther,
          seller: i.seller,
          owner: i.owner,
          name: meta.data.name,
          description: meta.data.description,
          image: meta.data.image,
        };
        return item;
      }),
    );
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
