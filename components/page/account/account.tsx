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
  onSaleNfts: INFT[];
};

export const AccountComponent: React.FC<Props> = (props) => {
  const { ownedNfts, walletAddress, onSaleNfts } = props;
  const tabOptions = ['Collected', 'On Sale'];
  const { hasCopied, onCopy } = useClipboard(walletAddress);
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };

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

      <Tabs size='lg' index={tabIndex} onChange={handleTabsChange}>
        <TabList px='12'>
          {tabOptions.map((tab, i) => (
            <Tab px='12' key={i}>
              {tab}
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          <TabPanel display={'flex'} gap={4}>
            {ownedNfts.map((nft) => {
              return <NFTItem key={nft.tokenId} nft={nft} />;
            })}
          </TabPanel>

          <TabPanel display={'flex'} gap={4}>
            {onSaleNfts.map((nft) => {
              return <NFTItem key={nft.tokenId} nft={nft} />;
            })}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
