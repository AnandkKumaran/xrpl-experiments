const xrpl = require('xrpl');
require('dotenv').config();

// *******************************************************
// ********************** Mint Token *********************
// *******************************************************

async function mintToken() {

    const token_url ="https://gateway.pinata.cloud/ipfs/QmSUsLyRvAb8Xc2aKXpKE9xXKzNdSpdhgsSu59eVtZJNn8";

    console.log(process.env.MNEMONIC)
    const wallet = xrpl.Wallet.fromMnemonic(process.env.MNEMONIC)
    const client = new xrpl.Client(process.env.RIPPLE_API)
    await client.connect()
    console.log('\nConnected. Minting NFT.')

    const transactionJson = {
        "TransactionType": "NFTokenMint",
        "Account": wallet.classicAddress,
        "URI": xrpl.convertStringToHex(token_url),
        "Flags": parseInt(8),
        "TransferFee": parseInt(25000),
        "NFTokenTaxon": 0 //Required, but if you have no use for it, set to zero.
    }

    console.log({transactionJson})

    const tx = await client.submitAndWait(transactionJson, { wallet: wallet })

    const nfts = await client.request({
        method: "account_nfts",
        account: wallet.classicAddress
    })

    console.log('\n\nTransaction result: ' + tx.result.meta.TransactionResult)
    console.log('\n\nnfts: ' + JSON.stringify(nfts, null, 2))

    client.disconnect()
} //End of mintToken()

mintToken();
