
    // SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CoinKraze.sol";

contract CoinKrazeFactory {
    address[] public deployedContracts;
    address platformWallet=msg.sender;
    uint256 percentage=10; 
    event NewCoinKrazeContract(address indexed deployedAddress);

    function createCoinKraze(
        address _token0,
        address _token1,
        string memory _symbol0,
        string memory _symbol1,
        uint256 _endDate
    ) external {
        CoinKraze newContract = new CoinKraze(
            platformWallet,
            percentage,
            _token0,
            _token1,
            _symbol0,
            _symbol1,
            _endDate
        );
        deployedContracts.push(address(newContract));
        emit NewCoinKrazeContract(address(newContract));
    }

    function getDeployedContracts() external view returns (address[] memory) {
        return deployedContracts;
    }
}


