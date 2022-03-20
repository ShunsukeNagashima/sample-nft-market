import { useState, useEffect, useCallback } from 'react';
import { ItemDetailComponent } from './item-detail';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import axios from 'axios';

import { INFT } from '../nft-list/types';
import { nftaddress, nftmarketaddress } from '../../../config';
import Market from '../../../artifacts/contracts/Market.sol/Market.json';
import NFT from '../../../artifacts/contracts/NFT.sol/NFT.json';

export const ItemDetail = () => {
  const [loadedNft, setLoadedNft] = useState<INFT>();
  const router = useRouter();

  const loadNFTByTokenId = useCallback(async () => {
    const { tokenId } = router.query;
    if (!tokenId) return;
    console.log(tokenId);
    const provider = new ethers.providers.JsonRpcProvider();
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider);
    const nftContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const token = await marketContract.fetchTokenByTokenId(1);
    const tokenUri = await nftContract.tokenURI(tokenId);
    const meta = await axios.get(tokenUri);
    const priceInEther = ethers.utils.formatUnits(token.price.toString(), 'ether');
    const item = {
      tokenId: parseInt(tokenId),
      priceInEther,
      seller: token.seller,
      owner: token.owner,
      name: meta.data.name,
      description: meta.data.description,
      image: meta.data.image,
    };
    setLoadedNft(item);
    console.log(item);
  }, [router.query]);

  useEffect(() => {
    loadNFTByTokenId();
  }, [loadNFTByTokenId]);

  return <ItemDetailComponent nft={loadedNft} />;
};
