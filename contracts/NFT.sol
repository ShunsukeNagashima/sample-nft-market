//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';

contract NFT is ERC721Enumerable, ERC721URIStorage {

    // address of marketplace for NFTs to interact
    address  contractAddress;

    function _beforeTokenTransfer(address from, address to,  uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from,  to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns(string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns(bool)
    {
        return super.supportsInterface(interfaceId);
    }


    constructor(address marketplaceAddress) ERC721('Clouds', 'CLOUDS') {
        contractAddress = marketplaceAddress;
    }

    function mint(string memory tokenUri) public returns(uint) {
        uint256 tokenId = totalSupply() + 1;
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenUri);
        setApprovalForAll(contractAddress, true);
        return tokenId;
    }

}
