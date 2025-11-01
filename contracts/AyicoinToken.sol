// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AyicoinToken - Advanced ERC20 Token Template
 * @dev Powered by Ayicoin Token Factory Platform
 * @notice Professional token standard with minting, burning, and transfer features
 */
contract AyicoinToken is ERC20, Ownable {
    uint256 private _maxSupply;
    bool private _transferEnabled;
    
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    event TransferStatusChanged(bool enabled);

    /**
     * @dev Initialize token with configuration
     * @param name_ Token name
     * @param symbol_ Token symbol  
     * @param initialSupply Initial token supply (in wei)
     * @param owner_ Token owner address
     * @param maxSupply_ Maximum token supply (0 for unlimited)
     */
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply,
        address owner_,
        uint256 maxSupply_
    ) ERC20(name_, symbol_) Ownable(owner_) {
        require(initialSupply > 0, "AyicoinToken: Initial supply must be positive");
        require(maxSupply_ == 0 || initialSupply <= maxSupply_, "AyicoinToken: Initial supply exceeds max supply");
        
        _maxSupply = maxSupply_;
        _transferEnabled = true;
        
        _mint(owner_, initialSupply);
        emit TokensMinted(owner_, initialSupply);
    }

    /**
     * @dev Mint new tokens (owner only)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(_maxSupply == 0 || totalSupply() + amount <= _maxSupply, 
                "AyicoinToken: Exceeds maximum supply");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    /**
     * @dev Burn tokens from caller's balance
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }

    /**
     * @dev Enable/disable token transfers
     */
    function setTransferEnabled(bool enabled) external onlyOwner {
        _transferEnabled = enabled;
        emit TransferStatusChanged(enabled);
    }

    /**
     * @dev Override transfer with transfer status check
     */
    function _update(address from, address to, uint256 value) internal override {
        require(_transferEnabled || from == owner(), "AyicoinToken: Transfers are disabled");
        super._update(from, to, value);
    }

    /**
     * @dev Get maximum supply (0 means unlimited)
     */
    function maxSupply() external view returns (uint256) {
        return _maxSupply;
    }

    /**
     * @dev Check if transfers are enabled
     */
    function transferEnabled() external view returns (bool) {
        return _transferEnabled;
    }

    /**
     * @dev Get token metadata
     */
    function getTokenInfo() external view returns (
        uint256 total,
        uint256 max,
        bool transfersEnabled,
        address tokenOwner
    ) {
        return (
            totalSupply(),
            _maxSupply,
            _transferEnabled,
            owner()
        );
    }
}