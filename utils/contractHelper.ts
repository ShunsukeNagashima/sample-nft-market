import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import axios from 'axios';

import { nftaddress, nftmarketaddress } from '../config';
import Market from '..//artifacts/contracts/Market.sol/Market.json';
import NFT from '..//artifacts/contracts/NFT.sol/NFT.json';
import { INFT } from '../components/page/nft-list/types';

export const buyMarketItem = async (price: string, itemId: number) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    const priceInWei = ethers.utils.parseUnits(price, 'ether');
    const transaction = await marketContract.buyNFT(nftaddress, itemId, { value: priceInWei });
    await transaction.wait();
}

const fetchAndFormatToken = async (nftContract: ethers.Contract, marketContract: ethers.Contract, tokenId: number) => {
  const token = await marketContract.fetchTokenByTokenId(tokenId);
  const tokenUri = await nftContract.tokenURI(tokenId);
  const meta = await axios.get(tokenUri);
  const priceInEther = ethers.utils.formatUnits(token.price.toString(), 'ether');
  const item: INFT = {
    itemId: token.itemId.toNumber(),
    tokenId: tokenId,
    priceInEther,
    seller: token.seller,
    owner: token.owner,
    name: meta.data.name,
    description: meta.data.description,
    image: meta.data.image,
  };
  return item;
}

export const fetchMarketItems = async () => {
  const provider = new ethers.providers.JsonRpcProvider();
  const nftContract = new ethers.Contract(nftaddress, NFT.abi, provider);
  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider);
  const itemCount = await marketContract.getItemCount();
  const tokenIds = Array.from(new Array(itemCount.toNumber())).map((v, i) => ++i);

  const items: INFT[] = await Promise.all(
    tokenIds.map(async (tokenId: number) => {
      const item = await fetchAndFormatToken(nftContract, marketContract, tokenId);
      return item;
    }),
  );
  return items;
}

export const fetchTokenById = async (tokenId: number) => {
  const provider = new ethers.providers.JsonRpcProvider();
  const nftContract = new ethers.Contract(nftaddress, NFT.abi, provider);
  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider);

  const item: INFT = await fetchAndFormatToken(nftContract, marketContract, tokenId);
  return item;
}

export const fetchOwnTokens = async () => {
  const provider = new ethers.providers.JsonRpcProvider();
  const nftContract = new ethers.Contract(nftaddress, NFT.abi, provider);
  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider);
  const ownTokenIds = await getOwnTokenIds()

  const items: INFT[] = await Promise.all(
    ownTokenIds.map(async (tokenId: number) => {
      const item = await fetchAndFormatToken(nftContract, marketContract, tokenId);
      return item;
    }),
  );
  return items;

}

export const getWalletAddress = async () => {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  return await signer.getAddress()
}

const getOwnTokenIds = async () => {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  const nftContract = new ethers.Contract(nftaddress, NFT.abi, provider);

  const ownerAddress = await signer.getAddress()
  const balance = (await nftContract.balanceOf(ownerAddress)).toNumber();

  const ownTokenIds = await Promise.all(
    Array.from(new Array(balance)).map((_, i) => i).map(async (v, index) => {
      const ownTokenId = await nftContract.tokenOfOwnerByIndex(ownerAddress, index);
      return ownTokenId.toNumber();
    })
  )
  return ownTokenIds;
}
