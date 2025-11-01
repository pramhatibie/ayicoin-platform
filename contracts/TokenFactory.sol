// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./AyicoinToken.sol";

/**
 * @title Ayicoin Token Factory
 * @dev Enterprise-grade token deployment platform
 * @notice Create, manage, and track ERC20 tokens with advanced features
 */
contract TokenFactory {
    struct TokenInfo {
        address tokenAddress;
        string name;
        string symbol;
        uint256 initialSupply;
        uint256 maxSupply;
        uint256 creationTime;
        address owner;
        bool isActive;
    }

    // Platform statistics
    uint256 private _totalTokensCreated;
    uint256 private _platformFee;
    address private _platformOwner;
    
    // User token tracking
    mapping(address => address[]) private _userTokens;
    mapping(address => uint256) private _userTokenCount;
    mapping(address => TokenInfo) private _tokenMetadata;
    mapping(address => bool) private _verifiedTokens;

    event TokenCreated(
        address indexed tokenAddress,
        string name,
        string symbol, 
        uint256 supply,
        uint256 maxSupply,
        address indexed owner,
        uint256 timestamp
    );
    
    event PlatformFeeUpdated(uint256 newFee);
    event TokenVerified(address indexed tokenAddress, bool verified);

    /**
     * @dev Initialize factory with platform settings
     */
    constructor() {
        _platformOwner = msg.sender;
        _platformFee = 0; // Can be updated for premium features
        _totalTokensCreated = 0;
    }

    /**
     * @dev Create new ERC20 token with advanced configuration
     * @param name_ Token name
     * @param symbol_ Token symbol  
     * @param initialSupply_ Initial token supply (in base units)
     */
    function createToken(
        string memory name_, 
        string memory symbol_, 
        uint256 initialSupply_
    ) external returns (address) {
        require(initialSupply_ > 0, "Supply must be greater than 0");
        require(bytes(name_).length > 0, "Name cannot be empty");
        require(bytes(symbol_).length > 0, "Symbol cannot be empty");
        require(bytes(symbol_).length <= 6, "Symbol too long");
        require(initialSupply_ <= 1000000 * 10**18, "Supply too large");

        // Set maxSupply = 0 (unlimited) by default
        uint256 maxSupply_ = 0;

        // Convert initialSupply to wei (18 decimals) for token constructor
        uint256 initialSupplyInWei = initialSupply_ * 10**18;

        // Deploy new token
        AyicoinToken newToken = new AyicoinToken(
            name_,
            symbol_,
            initialSupplyInWei,  // Parameter 3: initialSupply (in wei)
            msg.sender,          // Parameter 4: owner
            maxSupply_           // Parameter 5: maxSupply
        );
        
        address tokenAddress = address(newToken);
        
        // Store token metadata
        TokenInfo memory tokenInfo = TokenInfo({
            tokenAddress: tokenAddress,
            name: name_,
            symbol: symbol_,
            initialSupply: initialSupply_, // Store original supply (not in wei)
            maxSupply: maxSupply_,
            creationTime: block.timestamp,
            owner: msg.sender,
            isActive: true
        });
        
        _tokenMetadata[tokenAddress] = tokenInfo;
        _userTokens[msg.sender].push(tokenAddress);
        _userTokenCount[msg.sender]++;
        _totalTokensCreated++;

        emit TokenCreated(
            tokenAddress,
            name_,
            symbol_,
            initialSupply_,
            maxSupply_,
            msg.sender,
            block.timestamp
        );

        return tokenAddress;
    }

    /**
     * @dev Mark token as verified (platform owner only)
     */
    function verifyToken(address tokenAddress, bool verified) external {
        require(msg.sender == _platformOwner, "AyicoinFactory: Only platform owner");
        require(_tokenMetadata[tokenAddress].owner != address(0), "AyicoinFactory: Token not found");
        
        _verifiedTokens[tokenAddress] = verified;
        emit TokenVerified(tokenAddress, verified);
    }

    // ========== VIEW FUNCTIONS ==========

    /**
     * @dev Get user's deployed tokens
     */
    function getUserTokens(address user) external view returns (address[] memory) {
        return _userTokens[user];
    }

    /**
     * @dev Get number of tokens created by user
     */
    function getUserTokenCount(address user) external view returns (uint256) {
        return _userTokenCount[user];
    }

    /**
     * @dev Get detailed token information
     */
    function getTokenInfo(address tokenAddress) external view returns (TokenInfo memory) {
        require(_tokenMetadata[tokenAddress].owner != address(0), "AyicoinFactory: Token not found");
        return _tokenMetadata[tokenAddress];
    }

    /**
     * @dev Check if token is verified by platform
     */
    function isTokenVerified(address tokenAddress) external view returns (bool) {
        return _verifiedTokens[tokenAddress];
    }

    /**
     * @dev Get platform statistics
     */
    function getPlatformStats() external view returns (
        uint256 totalTokens,
        uint256 platformFee,
        address platformOwner
    ) {
        return (
            _totalTokensCreated,
            _platformFee,
            _platformOwner
        );
    }

    /**
     * @dev Get paginated tokens for user
     */
    function getUserTokensPaginated(
        address user, 
        uint256 page, 
        uint256 pageSize
    ) external view returns (address[] memory, uint256) {
        uint256 total = _userTokenCount[user];
        uint256 start = page * pageSize;
        
        if (start >= total) {
            return (new address[](0), total);
        }
        
        uint256 end = (start + pageSize > total) ? total : start + pageSize;
        address[] memory tokens = new address[](end - start);
        
        for (uint256 i = start; i < end; i++) {
            tokens[i - start] = _userTokens[user][i];
        }
        
        return (tokens, total);
    }

    /**
     * @dev Update platform fee (owner only)
     */
    function updatePlatformFee(uint256 newFee) external {
        require(msg.sender == _platformOwner, "Only platform owner");
        _platformFee = newFee;
        emit PlatformFeeUpdated(newFee);
    }
}