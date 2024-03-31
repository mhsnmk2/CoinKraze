

// Check if MetaMask is installed
if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
}

// Initialize Web3
let web3;
let contract;
let accounts;
let contestContract;
let contestContractaddy;
let token0;
let token1;
let abierc20=[
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    }
]

const abi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_token0",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_token1",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "_symbol0",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_symbol1",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_endDate",
                "type": "uint256"
            }
        ],
        "name": "createContest",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_platformWallet",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "deployedAddress",
                "type": "address"
            }
        ],
        "name": "newContest",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "deployedContests",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getDeployedContests",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const contestabi= [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_platformWallet",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_platformFeePercentage",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_token0",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_token1",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "_symbol0",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_symbol1",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_endDate",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "totalAlicecoins",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "totalBobcoins",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "aliceWins",
                "type": "address"
            }
        ],
        "name": "ContestEnded",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "Balances0",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "Balances1",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "Price0",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "price0",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "Price0feed",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "Price1",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "price1",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "Price1feed",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_oracle",
                "type": "address"
            }
        ],
        "name": "changeOracleAddress",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "contestEnded",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "deposit",
                "type": "address"
            }
        ],
        "name": "depositCoins",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "endContest",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "endDate",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "platformFeePercentage",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "platformWallet",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "requestPrice",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "requestPrice0Feed",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "requestPrice1Feed",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol0",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol1",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "token0",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "token1",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "total0Coins",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "total1Coins",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdrawProfits",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
let token1symbol;
let token0symbol;
let coin1deposits;
let coin2deposits;

async function init() {
    // Modern dapp browsers...
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            // Request account access
            let acc= await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log(acc[0]);
            accounts=acc[0];
            document.getElementById("connectWalletBtn").innerText= acc[0].slice(0,5) + "...." + acc[0].slice(35,42)

        } catch (error) {
            console.error(error);
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        web3 = new Web3(web3.currentProvider);
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }

    const address = '0x75358c176c297Fc85713795c0174ef3dBaf7Ca5D';

    // Initialize contract instance
    contract = new web3.eth.Contract(abi, address);
    let contests=await contract.methods.getDeployedContests().call({ from: accounts });
    console.log(contests);
    contestContractaddy= contests[contests.length-1];
    contestContract= new web3.eth.Contract(contestabi,contests[contests.length-1]);
    let checkContest=await contestContract.methods.contestEnded().call();
    if (checkContest==false){
        token0= await contestContract.methods.token0().call();
        token1= await contestContract.methods.token1().call();
        token0symbol= await contestContract.methods.symbol0().call();
        token1symbol= await contestContract.methods.symbol1().call();
        coin1deposits= await contestContract.methods.total0Coins().call()/10**18;
        coin2deposits= await contestContract.methods.total1Coins().call()/10**18;


        console.log(token0symbol);
        console.log(token1symbol);
        document.getElementById("depositToken1Btn").innerHTML= "Deposit " + token0symbol;
        document.getElementById("depositToken2Btn").innerHTML= "Deposit "+ token1symbol;
        document.getElementById("depositToken1Btn").style.visibility= "visible";
        document.getElementById("depositToken2Btn").style.visibility= "visible";
        document.getElementById("input1").style.visibility= "visible";

    }
    else{
        document.getElementById('wid').style.visibility="visible";
        let tokenWon= await contestContract.methods.tokenWon().call();
        document.getElementById("token").innerHTML= tokenWon + "... Withdraw If you have any";
        const withdrawbtn= document.getElementById('withdraw');
        withdrawbtn.addEventListener('click', async () => {
        let tx= checkContest.methods.withdrawProfits().send();
        }        
        )
    }
    

    
}

// Connect to MetaMask and load contract when the page loads
window.addEventListener('load', async () => {
    await init();
});

// Deposit Token 1
const depositToken1Btn = document.getElementById('depositToken1Btn');
depositToken1Btn.addEventListener('click', async () => {
    const accounts = await web3.eth.getAccounts();
    const account = accounts;

    try {
        // Call the depositToken1 function on the smart contract
        token0Contract= new web3.eth.Contract(abierc20, token0);
        let decimals= await token0Contract.methods.decimals().call();
        const amount = document.getElementById("input1").value*10**decimals; // Amount of Token 1 to deposit

        let allowance= await token0Contract.methods.allowance(account[0], contestContractaddy).call();
        console.log(allowance);
        if(allowance<=amount){
        await token0Contract.methods.approve(contestContractaddy,BigInt(amount)).send({from: account[0]});

        }
        await contestContract.methods.depositCoins(BigInt(amount),token0).send({ from: account[0] });
        console.log('Token 1 deposited successfully');
    } catch (error) {
        console.error(error);
    }
});

// Deposit Token 2
const depositToken2Btn = document.getElementById('depositToken2Btn');
depositToken2Btn.addEventListener('click', async () => {
    const accounts = await web3.eth.getAccounts();
    const account = accounts;
    try {
        
     // Call the depositToken1 function on the smart contract
     token1Contract= new web3.eth.Contract(abierc20, token1);
     let decimals= await token1Contract.methods.decimals().call();
     const amount = document.getElementById("input1").value*10**decimals; // Amount of Token 1 to deposit

     let allowance= await token1Contract.methods.allowance(account[0], contestContractaddy).call();
     console.log(allowance)
     if(allowance<=amount){
     await token1Contract.methods.approve(contestContractaddy,BigInt(amount)).send({from:account[0]});

     }
     await contestContract.methods.depositCoins(BigInt(amount),token1).send({ from: account[0] });
     console.log('Token 1 deposited successfully');
 } catch (error) {
     console.error(error);
 }
});


