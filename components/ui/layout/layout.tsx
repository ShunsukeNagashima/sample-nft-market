import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/Image';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link as ChakraLink,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons';
import { MdOutlineAccountBalanceWallet } from 'react-icons/md';
import { Web3Container } from '../../../container/web3-contaner';

type Link = {
  title: string;
  to: string;
};

const Links: Link[] = [
  {
    title: 'Explore',
    to: '/',
  },
  {
    title: 'Create',
    to: '/new',
  },
];

const NavLink = ({ title, to }: { title: string; to: string }) => (
  <ChakraLink
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={to}
  >
    {title}
  </ChakraLink>
);

export const Layout: React.FC = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { connectWallet, account, disconnect } = Web3Container.useContainer();
  console.log(account);

  return (
    <>
      <Box bg={'brand.primary'} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box marginTop={4}>
              <Image src='/Cloud-logos_transparent.png' width='80' height='160' objectFit='cover' alt='logo' />
            </Box>
          </HStack>
          <Flex alignItems={'center'}>
            <HStack as={'nav'} spacing={4} mr={4} display={{ base: 'none', md: 'flex' }}>
              {Links.map((link, i) => (
                <NavLink key={i} title={link.title} to={link.to} />
              ))}
            </HStack>
            {account ? (
              <Menu>
                <MenuButton as={Button} rounded={'full'} variant={'link'} cursor={'pointer'} minW={0}>
                  <Avatar size={'sm'} />
                </MenuButton>
                <MenuList>
                  <MenuItem>
                    <Link href='/account'>
                      <a style={{ width: '100%' }}>Account</a>
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={disconnect}>Disconnect</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button bg={'brand.primary'} onClick={connectWallet}>
                <MdOutlineAccountBalanceWallet />
              </Button>
            )}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>

      <Box p={4}>{children}</Box>
    </>
  );
};
