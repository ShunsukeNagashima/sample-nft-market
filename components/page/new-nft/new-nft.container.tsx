import { ethers } from 'ethers';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { NewNFTComponent } from './new-nft';
import Web3Modal from 'web3modal';
import { useForm } from 'react-hook-form';
import { create } from 'ipfs-http-client';

import { nftaddress, nftmarketaddress } from '../../../config';
import NFT from '../../../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../../../artifacts/contracts/Market.sol/Market.json';

export type FormInputs = {
  image: string;
  name: string;
  description: string;
  price?: number;
};

export type TypeOfSell = 'Fixed Price' | 'Timed Auction';

const client = create({ url: 'https://ipfs.infura.io:5001/api/v0' });

export const NewNFT = () => {
  const router = useRouter();
  const [fileUrl, setFileUrl] = useState('');
  const [howToSell, setHowToSell] = useState<TypeOfSell>('Fixed Price');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({ mode: 'onBlur' });

  const createMarketItem = useCallback(
    async (url: string, price: string) => {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      // mint token
      let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
      let transaction = await contract.mint(url);
      const tx = await transaction.wait();
      const event = tx.events[0];
      const value = event.args[2];
      const tokenId = value.toNumber();

      // list on market
      contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
      transaction = await contract.makeMarketItem(nftaddress, tokenId, price);
      await transaction.wait();
      router.push('/');
    },
    [router],
  );

  const onSubmit = useCallback(
    async (data: FormInputs) => {
      setIsLoading(true);
      const { name, description, price } = data;
      if (!name || !description || !price || !fileUrl) return;
      console.log(name, description, price);

      // upload to IPFS
      const metaData = JSON.stringify({
        name,
        description,
        image: fileUrl,
      });
      try {
        const added = await client.add(metaData);
        const url = `https://ipfs.infura.io/ipfs/${added.path}`;
        const priceInWei = ethers.utils.parseUnits(price.toString(), 'ether');
        createMarketItem(url, priceInWei.toString());
      } catch (err) {
        console.log('Error uploading file: ', err);
      }
      setIsLoading(false);
    },
    [fileUrl, createMarketItem],
  );

  const onSwitch = (type: TypeOfSell) => {
    setHowToSell(type);
  };

  const onChange = useCallback(async (e) => {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (err) {
      console.log('Error uploading file: ', err);
    }
  }, []);

  const onClear = useCallback(() => {
    setFileUrl('');
  }, []);

  return (
    <NewNFTComponent
      onSubmit={onSubmit}
      onSwitch={onSwitch}
      onChange={onChange}
      onClear={onClear}
      fileUrl={fileUrl}
      isLoading={isLoading}
      howToSell={howToSell}
      register={register}
      handleSubmit={handleSubmit}
      errors={errors}
    />
  );
};
