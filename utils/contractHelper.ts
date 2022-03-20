import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

import { nftaddress, nftmarketaddress } from '../config';
import Market from '..//artifacts/contracts/Market.sol/Market.json';
import NFT from '..//artifacts/contracts/NFT.sol/NFT.json';
import { JsonRpcProvider } from '@ethersproject/providers';

export const buyMarketItem = async (price: string, itemId: number) => {
  try {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    const priceInWei = ethers.utils.parseUnits(price, 'ether');
    const transaction = await marketContract.buyNFT(nftaddress, itemId, { value: priceInWei });
    await transaction.wait();
  } catch (err) {
    console.log('Failed to buy, ', err.message);
  }
}
