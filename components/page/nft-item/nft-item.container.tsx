import { NFTItemComponent } from './nft-item';
import { INFT } from '../nft-list/types';

type Props = {
  nft: INFT;
};

export const NFTItem: React.FC<Props> = ({ nft }) => {
  return <NFTItemComponent nft={nft} />;
};
