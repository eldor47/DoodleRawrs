
// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract DoodleRawrs is ERC721, Ownable {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokensMinted;

    string public baseURI;
    string public baseExtension = ".json";
    uint256 public cost = 0.02 ether;
    uint256 public freeSupply = 1000;
    uint256 public maxSupply = 3000;
    uint256 public maxMintAmount = 10;
    bool public paused = false;

    address public giveaway = 0x39Db30EAcD019fe0c1B1F87B780f6ee48325396f;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _initBaseURI
    ) ERC721(_name, _symbol) {
        setBaseURI(_initBaseURI);
        // Mint first to giveaway address
        mintFree(giveaway, 1);
    }

    // internal
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    // Public Mint Functions
    function mint(address _to, uint256 _mintAmount) public payable {
        require(tx.origin == _msgSender(), "Only EOA");
        require(!paused);
        require(_mintAmount > 0);
        require(_tokensMinted.current() + _mintAmount <= maxSupply);

        require(_mintAmount <= maxMintAmount);
        require(msg.value >= cost * _mintAmount, "Not enough ether");

        for (uint256 i = 1; i <= _mintAmount; i++) {
            _tokensMinted.increment();
            _safeMint(_to, _tokensMinted.current());
        }
    }

    function mintFree(address _to, uint256 _mintAmount) public payable {
        require(tx.origin == _msgSender(), "Only EOA");
        require(!paused);
        require(_mintAmount > 0);
        require(_tokensMinted.current() + _mintAmount <= freeSupply);

        for (uint256 i = 1; i <= _mintAmount; i++) {
            _tokensMinted.increment();
            _safeMint(_to, _tokensMinted.current());
        }
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
        _exists(tokenId),
        "ERC721Metadata: URI query for nonexistent token"
        );

        string memory currentBaseURI = _baseURI();
        return bytes(currentBaseURI).length > 0
            ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension))
            : "";
    }

    //only owner
    function setCost(uint256 _newCost) public onlyOwner() {
        cost = _newCost;
    }

    function setmaxMintAmount(uint256 _newmaxMintAmount) public onlyOwner() {
        maxMintAmount = _newmaxMintAmount;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
        baseExtension = _newBaseExtension;
    }

    function pause(bool _state) public onlyOwner {
        paused = _state;
    }

    function withdraw() public payable onlyOwner {
        require(payable(msg.sender).send(address(this).balance));
    }

    function totalSupply() public view returns (uint256) {
        return _tokensMinted.current();
    }
}