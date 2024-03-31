
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./CoinKraze.sol";

contract CoinKrazeFactory {
    address[] public deployedContests;
    uint256 totalContests=0;
    address platformWallet;
    uint256 percentage=10; 
    event newContest(address indexed deployedAddress);
    constructor(address _platformWallet){
        platformWallet= _platformWallet;
    }

    function createContest(
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
        ++totalContests;
        deployedContests.push(address(newContract));
        emit newContest(address(newContract));
    }

    function getDeployedContests() external view returns (address[] memory) {
        return deployedContests;
    }
}

