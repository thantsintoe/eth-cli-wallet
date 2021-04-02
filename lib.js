const Web3 = require('web3')
const fs = require('fs')

let web3
module.exports.initWeb3 = function() {
  web3 = new Web3(
    new Web3.providers.WebsocketProvider(
      'wss://mainnet.infura.io/ws/v3/398dbd17c02c4a37ba1a0e902742cf2b'
    )
  )
  console.log("Web 3 is initialised")
  return web3
}

module.exports.transferEth = async function (from, to, amount, password) {
  let wallet = loadWallet(password)
  let signedTx = await web3.eth.accounts.signTransaction(
    {
      from,
      gasPrice: transaction.gasPrice,
      gasLimit: transaction.gasLimit,
      to,
      value: amount
    },
    wallet.privateKey
  )
  console.log(signedTx)
  return new Promise(resolve => {
    web3.eth
      .sendSignedTransaction(signedTx.rawTransaction)
      .on('transactionHash', function (hash) {
        console.log('Tx hash: ', hash)
        resolve(hash)
      })
  })
}

module.exports.sendToken = async function (
  to,
  amount,
  tokenAddress,
  password
) {
  let wallet = loadWallet(password)
  let myAddress = wallet.address
  let toAddress = to
  let amountInHex = web3.utils.toHex(amount)
  let count = await web3.eth.getTransactionCount(myAddress)
  let contract = new web3.eth.Contract(tokenABI, tokenAddress, {
    from: myAddress
  })
  let transaction = await web3.eth.accounts.signTransaction(
    {
      from: myAddress,
      gasPrice: web3.utils.toHex(tx.gasPrice),
      gasLimit: web3.utils.toHex(tx.gasLimit),
      to: tokenAddress,
      value: '0x0',
      data: contract.methods.transfer(toAddress, amountInHex).encodeABI(),
      nonce: web3.utils.toHex(count)
    },
    wallet.privateKey
  )
  return new Promise(resolve => {
    web3.eth
      .sendSignedTransaction(transaction.rawTransaction)
      .on('transactionHash', function (hash) {
        console.log('Tx hash: ', hash)
        resolve(hash)
      })
  })
}

module.exports.createWallet = function(password) {
  const wallet = web3.eth.accounts.wallet.create(1);
  const encryptedWallet = web3.eth.accounts.wallet.encrypt(password)
  if (encryptedWallet.length > 0) {
    saveWallet(encryptedWallet[0])
    return encryptedWallet[0]
  }
}

function loadWallet (password) {
  let walletStr = fs.readFileSync('./keystore.json')
  if (!walletStr) throw new Error('No wallet found')
  let encryptedWallet = JSON.parse(walletStr)
  let decryptedWallet = web3.eth.accounts.wallet.decrypt(encryptedWallet, password)
  if(decryptedWallet.length > 0) return decryptedWallet[0]
}

function saveWallet (wallet) {
  fs.writeFileSync('./keystore.json', JSON.stringify(wallet))
}

module.exports.loadWallet = loadWallet
