const { expect } = require('chai');
const { ethers } = require('hardhat');

let market;
let marketContractAddress;
let nft;
let nftContractAddress;

beforeEach(async () => {
  Market = await ethers.getContractFactory('Market');
  market = await Market.deploy();
  await market.deployed();
  marketContractAddress = market.address;

  NFT = await ethers.getContractFactory('NFT');
  nft = await NFT.deploy(marketContractAddress);
  await nft.deployed();
  nftContractAddress = nft.address;
});

describe('Market', () => {
  it('should make market item', async () => {
    const minter = await ethers.getSigners();
    await nft.mint('http:t-1');
    expect(await nft.totalSupply(), 1);
    expect(await nft.ownerOf(0), minter.address);

    const priceInWei = ethers.utils.parseUnits('10', 'ether');
    await market.makeMarketItem(nftContractAddress, 0, priceInWei);
  });

  it('should buy NFT', async () => {
    const [ownerAddress, sellerAddress, buyerAddress] = await ethers.getSigners();

    await nft.connect(sellerAddress).mint('http:t-1');
    await nft.connect(sellerAddress).mint('http:t-2');

    const priceInWei = ethers.utils.parseUnits('10', 'ether');

    await market.connect(sellerAddress).makeMarketItem(nftContractAddress, 0, priceInWei);
    await market.connect(sellerAddress).makeMarketItem(nftContractAddress, 1, priceInWei);

    expect(await nft.ownerOf(0), sellerAddress.address);

    await market.connect(buyerAddress).buyNFT(nftContractAddress, 1, { value: priceInWei });

    const balanceOfSeller = ethers.utils.formatUnits(await sellerAddress.getBalance(), 'ether');
    const balanceOfOwner = ethers.utils.formatUnits(await ownerAddress.getBalance(), 'ether');

    expect(await nft.ownerOf(0), buyerAddress.address);
    expect(balanceOfSeller > 10009);
    expect(balanceOfOwner > 10000.24);
  });
});
