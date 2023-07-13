const xrpl = require('xrpl');
const bip39 = require('bip39');

const mnemonic = bip39.generateMnemonic();
const wallet = xrpl.Wallet.fromMnemonic(mnemonic);
console.log({
  mnemonic,
  address: wallet.classicAddress,
  privateKey: wallet.privateKey,
});