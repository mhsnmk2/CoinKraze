pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";

interface IERC20 {
    function transfer(address recipient, uint256 amount)  external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

interface Morpheus {
function getFeed(uint256 feedID)
        external
        view
        returns (
            uint256 value,
            uint256 decimals,
            uint256 timestamp,
            string memory valStr
        );   

    function requestFeeds(
        string[] calldata APIendpoint,
        string[] calldata APIendpointPath,
        uint256[] calldata decimals,
        uint256[] calldata bounties
    ) external payable returns (uint256[] memory feeds);

    function supportFeeds(
        uint256[] calldata feedIds,
        uint256[] calldata values
    ) external payable;
}



contract CoinKraze {
    address public platformWallet;
    uint256 public platformFeePercentage;
    address public token0;
    address public token1;
    uint256 public endDate;
    uint256 public total0Coins;
    uint256 public total1Coins;
    string public symbol0;
    Morpheus morpheus = Morpheus(0x0000000000071821e8033345A7Be174647bE0706);
    uint256 public Price0feed ;
    uint256 public Price1feed ;
    string public symbol1;
    mapping(address => uint256) public Balances0;
    mapping(address => uint256) public Balances1;
    bool public contestEnded=false;
    address tokenWon;

    event ContestEnded(uint256 totalAlicecoins, uint256 totalBobcoins, address aliceWins);

    constructor(
        address _platformWallet,
        uint256 _platformFeePercentage,
        address _token0,
        address _token1,
        string memory _symbol0,
        string memory _symbol1,
        uint256 _endDate
    ) {
        platformWallet = _platformWallet;
        platformFeePercentage = _platformFeePercentage;
        token0 = _token0;
        token1 = _token1;
        symbol0= _symbol0;
        symbol1= _symbol1;
        endDate = _endDate;
    }

    function depositCoins(uint256 amount, address deposit) external {
        require(block.timestamp < endDate, "Contest has ended");
        require (deposit== token0 || deposit== token1,"Wrong Contest" );
        
        require(IERC20(deposit).transferFrom(msg.sender, address(this), amount), "Failed to transfer Alicecoins");
        if(deposit==token0){
        Balances0[msg.sender] += amount;
        total0Coins += amount;

        }
        else{
 Balances1[msg.sender] += amount;
        total1Coins += amount;
        }
    }
    function requestPrice() external payable{
        require(msg.value>0.002 ether);
        requestPrice0Feed();
        requestPrice1Feed();
    }

    function endContest() external {
        
        require(block.timestamp >= endDate, "Contest has not ended yet");
        uint256 price0= Price0();
        uint256 price1= Price1(); 
        require(price0 !=0 && price1 !=0, "Waiting for feed");
        address tokenWins = (price0 * total0Coins) > (price1 * total1Coins)? token0: token1;

        uint256 platformFee = (total0Coins + total1Coins) * platformFeePercentage / 100;
        IERC20(token0).transfer(platformWallet, platformFee);
        IERC20(token1).transfer(platformWallet, platformFee);
        contestEnded=true;
        emit ContestEnded(total0Coins, total1Coins, tokenWins);
    }
    //used from docs

function requestPrice0Feed() internal {
        string[] memory apiEndpoint = new string[](1);
        apiEndpoint[0] = string.concat(
            "https://158.160.4.1/symbol/",symbol0, "/time/", Strings.toString(endDate));            

        string[] memory apiEndpointPath = new string[](1);
        apiEndpointPath[0] = "price";

        uint256[] memory decimals = new uint256[](1);
        decimals[0] = 0;

        uint256[] memory bounties = new uint256[](1);
        bounties[0] = 0.0001 ether; // Replace with actual bounty value

        uint256[] memory feeds = morpheus.requestFeeds{value: 0.0001 ether}(
            apiEndpoint,
            apiEndpointPath,
            decimals,
            bounties
        );
     Price0feed = feeds[0];
    }
    //used from docs
function requestPrice1Feed() public payable {
        string[] memory apiEndpoint = new string[](1);
        apiEndpoint[0] = string.concat(
            "https://158.160.4.1/symbol/",symbol1, "/time/", Strings.toString(endDate));            

        string[] memory apiEndpointPath = new string[](1);
        apiEndpointPath[0] = "price";

        uint256[] memory decimals = new uint256[](1);
        decimals[0] = 0;

        uint256[] memory bounties = new uint256[](1);
        bounties[0] = 0.0001 ether;
        uint256[] memory feeds = morpheus.requestFeeds{value: 0.0001 ether}(
            apiEndpoint,
            apiEndpointPath,
            decimals,
            bounties
        );
     Price1feed = feeds[0]; 
    }


    //used from docs

     function Price0() public view returns(uint256 price0) {
(price0,,,) = morpheus.getFeed(
            Price0feed
        );
        return price0;
    }
     function Price1() public view returns(uint256 price1) {
(price1,,,) = morpheus.getFeed(
            Price1feed
        );
        return price1;
    }


    function withdrawProfits () external{
        require(contestEnded=true, "Contest In Progress");
        uint256 bal;
        uint256 profit;
        if(tokenWon== token0){
            bal= Balances0[msg.sender];
            require(bal>0);
            Balances0[msg.sender]= 0;
            profit = ((bal/ total0Coins))*total1Coins;   
            IERC20(token0).transfer(msg.sender,bal);
            IERC20(token1).transfer(msg.sender,profit);
        }
        else{
            bal= Balances1[msg.sender];
            require(bal>0);
            Balances1[msg.sender]= 0;
            profit = ((bal/ total1Coins))*total0Coins;   
            IERC20(token1).transfer(msg.sender,bal);
            IERC20(token0).transfer(msg.sender,profit);
        }


    }
}

