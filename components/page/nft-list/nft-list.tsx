import { Wrap, WrapItem, Container } from '@chakra-ui/react';
import { INFT } from './types';
import { NFTItem } from '../nft-item';

type Props = {
  nfts: INFT[];
};

export const NFTListComponent: React.FC<Props> = ({ nfts }) => {
  return (
    <Container maxW='container.2xl' mt={12} centerContent>
      <Wrap spacing={4}>
        {nfts.map((nft) => {
          return (
            <WrapItem key={nft.tokenId}>
              <NFTItem nft={nft} />
            </WrapItem>
          );
        })}
      </Wrap>
    </Container>
  );
};
