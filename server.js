const express = require('express')
const Web3 = require('web3');
const axios = require('axios');
const EthereumTx = require('ethereumjs-tx').Transaction;

const privKey = '4071935e53cb8578e1c6567430b808ff9c8843508536104e73e4356bfa501a9c';
const addressFrom = '0x94a7F4031797D2E94C6e6E21D1Bf26aD71f9C5bA';
const addressTo = '0xed1Dc05307c1d64c20DC11aEbFFeEF7a06a941d8';
const chainId = 1337;
const ethNetwork = 'http://localhost:7545';
//const ethNetwork = 'https://mainnet.infura.io/v3/b89d0b2bc7464adcbbb9ffb458c5dc08';
const marketPlaceContractConfig = require('./config');

const web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));
const marketplaceContract = new web3.eth.Contract(marketPlaceContractConfig.MARKETPLACE_ABI, marketPlaceContractConfig.MARKETPLACE_ADDRESS);

const app = express();

async function transferFundsOnlyWeb3js(sendersData, recieverData, amountToSend) {
  return new Promise(async (resolve, reject) => {
      var nonce = await web3.eth.getTransactionCount(sendersData.address);
      web3.eth.getBalance(sendersData.address, async (err, result) => {
          if (err) {
              return reject();
          }
          let balance = web3.utils.fromWei(result, "ether");
          if(balance < amountToSend) {
              console.log('insufficient funds');
              return reject();
          }
 
          let gasPrices = await getCurrentGasPrices();
          let details = {
              "to": recieverData.address,
              "value": web3.utils.toHex(web3.utils.toWei(amountToSend.toString(), 'ether')),
              "gas": 21000,
              "gasPrice": gasPrices.low * 1000000000,
              "nonce": nonce,
              "chainId": chainId
          };
          
          const signedTx = await web3.eth.accounts.signTransaction(details, privKey);
          web3.eth.sendSignedTransaction(signedTx.rawTransaction, (err, id) => {
              if(err) {
                  console.log(err);
                  return reject();
              }
              resolve(id);
          });
      });
  });
}

async function transferFundsOnlyWeb3jsAndEtherjs(sendersData, recieverData, amountToSend) {
  return new Promise(async (resolve, reject) => {
      var nonce = await web3.eth.getTransactionCount(sendersData.address);
      web3.eth.getBalance(sendersData.address, async (err, result) => {
          if (err) {
              return reject();
          }
          let balance = web3.utils.fromWei(result, "ether");
          if(balance < amountToSend) {
              console.log('insufficient funds');
              return reject();
          }
 
          let gasPrices = await getCurrentGasPrices();
          let details = {
              "to": recieverData.address,
              "value": web3.utils.toHex(web3.utils.toWei(amountToSend.toString(), 'ether')),
              "gas": 21000,
              "gasPrice": gasPrices.low * 1000000000,
              "nonce": nonce,
              "chainId": chainId
          };
         
          const transaction = new EthereumTx(details);
          let privKey = Buffer.from(sendersData.privateKey,'hex');
          transaction.sign(privKey);
          const serializedTransaction = transaction.serialize();
          
          web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'), (err, id) => {
              if(err) {
                  console.log(err);
                  return reject();
              }
              resolve(id);
          });
      });
  });
}

async function transferFundsOnlyContract(sendersData, recieverData, amountToSend) {
  return new Promise(async (resolve, reject) => {
      web3.eth.getBalance(sendersData.address, async (err, result) => {
          if (err) {
              return reject();
          }

          let balance = web3.utils.fromWei(result, "ether");
          if(balance < amountToSend) {
              console.log('insufficient funds');
              return reject();
          }
          
          var amount = web3.utils.toWei(amountToSend.toString(), 'ether')
          var response = await marketplaceContract.methods.createTransaction(recieverData.address).send({ from: sendersData.address, value: amount, gas: 6721975, gasPrice: '30000000' });
          resolve(response.transactionHash);
      });
  });
}

async function transferFundsOnlyWeb3jsWithoutSign(sendersData, recieverData, amountToSend){
  return new Promise(async (resolve, reject) => {
    const duration = 30.0
    const amount = web3.utils.toWei(amountToSend.toString(), 'ether')
    const result = await web3.eth.personal.unlockAccount(sendersData.address, sendersData.privateKey, duration)
    if (result === true) {
      const txResult = await web3.eth.sendTransaction({
        from: sendersData.address,
        to: recieverData.address,
        value: amount.toString()
      })
      resolve(txResult.transactionHash);
    } else {
      return reject();
    }
  });
}

async function getCurrentGasPrices() {
  let response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
  let prices = {
    low: response.data.safeLow / 10,
    medium: response.data.average / 10,
    high: response.data.fast / 10
  };
  return prices;
}

async function getBalance(address) {
  return new Promise((resolve, reject) => {
      web3.eth.getBalance(address, async (err, result) => {
          if(err) {
              return reject(err);
          }
          resolve(web3.utils.fromWei(result, "ether"));
      });
  });
}

async function getAccounts(){
  const accounts = await web3.eth.getAccounts();
  console.log(accounts);
}

app.get('/', (req, res) => {
  transferFundsOnlyContract({address: addressFrom, privateKey: privKey}, {address: addressTo}, 1).then((res) => {
    console.log(res);
  })
  .catch(err => {
    console.error(err);
  });
});

app.listen(3000, () => {console.log(`Example app listening on port 3000`)});