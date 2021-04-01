const vorpal = require('vorpal')()
const lib = require('./lib')

lib.initWeb3()

let isWalletLoaded = false
let address

// COMMAND TO CREATE TOKENS FOR A USER ACCOUNT ON THE NETWORK (TEST ONLY)
vorpal.command('load', 'Load wallet from key store file').action(async function(args, callback) {
  const answers = await this.prompt([
    {
      type: 'input',
      name: 'password',
      message: 'Enter your password to decrypt keystore file: ',
    }
  ])
  const password = answers.password
  if (!password) {
    this.log('No password')
    callback()
  } else {
    let wallet = lib.loadWallet(password)
    if (wallet) {
      this.log('Wallet loaded')
      isWalletLoaded = true
      address = wallet.address
    }
  }
})

vorpal.command('create', 'Create a new wallet').action(async function(args, callback) {
  const answers = await this.prompt([
    {
      type: 'input',
      name: 'password1',
      message: 'Enter your password to encrypt keystore file: ',
    },
    {
      type: 'input',
      name: 'password2',
      message: 'Enter your password again: ',
    }
  ])
  if (answers.password1 !== answers.password2) throw new Error("Different passwords")
  const password = answers.password1
  if (!password) {
    this.log('No password')
    callback()
  } else {
    let wallet = lib.createWallet(password)
    if (wallet) {
      this.log('Wallet created. Please see keystore.json file in this directory.')
      isWalletLoaded = true
      address = wallet.address
    }
  }
})

vorpal.command('balance', 'Check your balance').action(async function(args, callback) {
  if (!address) throw new Error("Wallet is not loaded yet")
  // TODO: to implement balance checking feature
})

vorpal.delimiter('>').show()
vorpal.exec('init').then(res => (USER = res))
