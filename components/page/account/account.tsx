import { useState } from 'react';
import {
  Center,
  Box,
  Avatar,
  Stack,
  Heading,
  Button,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  useClipboard,
  Tooltip,
} from '@chakra-ui/react';
import { INFT } from '../nft-list/types';
import { NFTItem } from '../nft-item';

type Props = {
  ownedNfts: INFT[];
  walletAddress: string;
};

export const AccountComponent: React.FC<Props> = (props) => {
  const { ownedNfts, walletAddress } = props;
  const tabOptions = ['Collected'];
  const { hasCopied, onCopy } = useClipboard(walletAddress);

  return (
    <Box>
      <Center pt='12'>
        <Box>
          <Center>
            <Avatar
              size={'xl'}
              alt={'Owner'}
              css={{
                border: '2px solid white',
              }}
            />
          </Center>
          <Stack spacing={0} align={'center'} mb={6}>
            <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'} my={6}>
              User Name shoube be comming
            </Heading>
            <Tooltip label={hasCopied ? 'Copied!' : 'Copy'} placement='top'>
              <Button onClick={onCopy} borderColor={'gray.600'} border={'2px'} borderRadius={'30px'} bg={'white'}>
                {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
              </Button>
            </Tooltip>
          </Stack>
        </Box>
      </Center>

      <Tabs size='lg'>
        <TabList px='12'>
          {tabOptions.map((tab, i) => (
            <Tab px='12' key={i}>
              {tab}
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          <TabPanel justifyContent={'start'}>
            {ownedNfts.map((nft) => {
              return <NFTItem key={nft.tokenId} nft={nft} />;
            })}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
