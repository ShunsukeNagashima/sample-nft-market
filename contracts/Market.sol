//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import "@openzeppelin/contracts/access/Ownable.sol";
import '@openzeppelin/contracts/utils/Counters.sol';

contract Market is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    // counter for tokens sold
    Counters.Counter private _soldTokenIds;

    // owner of the contract
    address payable marketOwner;

    // take 2.5% for listing fee
    uint256 salesFeeRate = 250;

    struct MarketToken {
        uint itemId;
        address nftContract;
        uint tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    // mapping from tokenId to MarketToken
    mapping(uint256 => MarketToken) private idToMarketToken;

    event MarketTokenMinted(
      uint256 indexed itemId,
      address indexed nftContract,
      uint256 indexed tokenId,
      address seller,
      address owner,
      uint256 price,
      bool sold
    );

    constructor() {
        marketOwner = payable(msg.sender);
    }

    function getItemCount() public view returns(uint256) {
      return _tokenIds.current();
    }

    function makeMarketItem(address nftContract, uint256 tokenId, uint256 price) public nonReentrant {
        _tokenIds.increment();
        uint256 itemId = _tokenIds.current();

        idToMarketToken[itemId] = MarketToken(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );

        // transfer NFT
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketTokenMinted(itemId, nftContract, tokenId, msg.sender, address(0), price, false);
    }

    function buyNFT(address nftContract, uint256 itemId) public payable nonReentrant {
        uint256 tokenId = idToMarketToken[itemId].tokenId;
        uint256 price = idToMarketToken[itemId].price;
        require(msg.value == price, 'Please submit the asking price in order to continue');

        uint256 salesFee = (price * salesFeeRate) / 10000;
        idToMarketToken[itemId].seller.transfer(msg.value - salesFee);

        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);

        idToMarketToken[itemId].owner = payable(msg.sender);
        idToMarketToken[itemId].sold = true;

        marketOwner.transfer(salesFee);
    }


    function fetchTokenByTokenId(uint256 tokenId) public view returns(MarketToken memory) {
      return idToMarketToken[tokenId];
    }

}
