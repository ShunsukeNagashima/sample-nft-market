import { INFT } from './types';
import { NFTItem } from '../nft-item';

type Props = {
  nfts: INFT[];
};

export const NFTListComponent: React.FC<Props> = ({ nfts }) => {
  return (
    <>
      {nfts.map((nft) => {
        return <NFTItem key={nft.tokenId} nft={nft} />;
      })}
    </>
  );
};
