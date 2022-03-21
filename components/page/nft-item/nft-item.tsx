import { Box, useColorModeValue, Flex, Button, Divider, HStack, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { ethers } from 'ethers';

import { INFT } from '../nft-list/types';
import { buyMarketItem } from '../../../utils/contractHelper';

type Props = {
  nft: INFT;
};

export const NFTItemComponent: React.FC<Props> = ({ nft }) => {
  return (
    <Flex alignItems='center' justifyContent='start'>
      <Box bg={useColorModeValue('white', 'gray.800')} maxW='sm' borderWidth='1px' rounded='xl' shadow='lg'>
        <Link href={`/assets/${nft.tokenId}`}>
          <a>
            <Box>
              <Image src={nft.image} alt={`Picture of ${nft.name}`} width={320} height={320} />

              <Box px='6' py='3'>
                <Box d='flex' alignItems='baseline'></Box>
                <Flex mt='1' justifyContent='space-between' alignContent='center'>
                  <Box fontSize='xl' fontWeight='semibold' as='h4' lineHeight='tight' isTruncated>
                    {nft.name}
                  </Box>
                </Flex>

                <HStack spacing={6} justifyContent='space-between'>
                  <Box fontSize='sm' color={useColorModeValue('gray.800', 'white')} isTruncated maxW={200}>
                    <Box color={'gray.600'} fontSize='xs'>
                      Seller
                    </Box>
                    {nft.seller}
                  </Box>
                  <Box fontSize='sm' color={useColorModeValue('gray.800', 'white')}>
                    <Box color={'gray.600'} fontSize='xs'>
                      Price
                    </Box>
                    {nft.priceInEther}
                    <Box as='span' color={'gray.600'} fontSize='xs' ml={2}>
                      ETH
                    </Box>
                  </Box>
                </HStack>
              </Box>
            </Box>
          </a>
        </Link>

        <Divider />

        <Flex justifyContent='end' px='6' py='3'>
          {nft.owner == ethers.constants.AddressZero ? (
            <Button onClick={() => buyMarketItem(nft.priceInEther, nft.itemId)} borderRadius='30px' size='xs'>
              Buy Now
            </Button>
          ) : (
            <Text fontSize='sm' color={'gray.600'}>
              Owned Item
            </Text>
          )}
        </Flex>
      </Box>
    </Flex>
  );
};
