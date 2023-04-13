const MARKETPLACE_ADDRESS = '0x55c43d9Fb0E4b6f706e691788C1a06D605Bac9C8';
const MARKETPLACE_ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "count",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x06661abd"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "transactions",
    "outputs": [
      {
        "name": "id",
        "type": "uint256"
      },
      {
        "name": "amount",
        "type": "uint256"
      },
      {
        "name": "sender",
        "type": "address"
      },
      {
        "name": "reciever",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x9ace38c2"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "addressReciever",
        "type": "address"
      }
    ],
    "name": "createTransaction",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function",
    "signature": "0xa23927ee"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getCount",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xa87d942c"
  }
];

module.exports = {
        MARKETPLACE_ADDRESS,
        MARKETPLACE_ABI,
};