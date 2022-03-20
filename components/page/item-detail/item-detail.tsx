import { Box, HStack, Stack, Text, VStack, Divider, Button, Tooltip } from '@chakra-ui/react';
import { MdOutlineDescription, MdOutlineAccountBalanceWallet } from 'react-icons/md';
import { SiEthereum } from 'react-icons/si';
import { INFT } from '../nft-list/types';
import { buyMarketItem } from '../../../utils/contractHelper';
import { ethers } from 'ethers';

type Props = {
  nft: INFT;
};

export const ItemDetailComponent: React.FC<Props> = ({ nft }) => {
  if (!nft) {
    return <div>Loading...</div>;
  }

  return (
    <HStack justifyContent='center' alignItems='start' gap='8'>
      <Stack boxShadow='lg' m='4' borderRadius='md' maxW='lg'>
        <Stack p='2'>
          <SiEthereum />
        </Stack>
        <Divider />
        <img src={nft.image} alt='picture of nft' />
      </Stack>

      <VStack alignItems='start'>
        <Text fontSize='4xl' fontWeight='bold'>
          {nft.name}
        </Text>

        {nft.owner != ethers.constants.AddressZero ? (
          <Text fontSize='sm' color={'gray.600'}>
            Owned by {nft.owner}
          </Text>
        ) : (
          <Text fontSize='sm' color={'gray.600'}>
            On Sale
          </Text>
        )}

        <Stack boxShadow='lg' borderRadius='md' maxW='lg'>
          <Stack p='4' pb='0' direction='row' alignItems='center'>
            <MdOutlineDescription />
            <Text fontWeight='semibold'>Description</Text>
          </Stack>

          <Divider />

          <VStack alignItems='start' p='4' pt='0'>
            <Text fontSize={{ base: 'sm' }} textAlign={'left'} maxW={'4xl'}>
              Created By {nft.seller}
            </Text>
            <Text fontSize={{ base: 'sm' }} textAlign={'left'} maxW={'4xl'}>
              {nft.description}
            </Text>
          </VStack>
        </Stack>

        <Stack boxShadow='lg' m='4' borderRadius='md' maxW='lg' minW='md'>
          <Stack p='4' pb='0' direction='row' alignItems='center'>
            <SiEthereum />
            <Text fontWeight='semibold'>Price</Text>
          </Stack>

          <Divider />

          <HStack alignItems='center' px='4' gap={2}>
            <Tooltip label='ETH' placement='top'>
              <img src='/ethereum-eth-logo.svg' alt='ethereum-logo' width={20} height={20} />
            </Tooltip>
            <Text fontWeight='bold' fontSize='4xl' textAlign={'left'}>
              {nft.priceInEther}
            </Text>
          </HStack>
          {nft.owner == ethers.constants.AddressZero && (
            <HStack p='4' pt='0'>
              <Button
                onClick={() => buyMarketItem(nft.priceInEther, nft.itemId)}
                gap='2'
                bg={'white'}
                border={'2px solid'}
                borderColor={'brand.primary'}
                color={'brand.primary'}
                _hover={{ bg: 'brand.primary', color: 'white' }}
              >
                <MdOutlineAccountBalanceWallet />
                Buy Now
              </Button>
            </HStack>
          )}
        </Stack>
      </VStack>
    </HStack>
  );
};
