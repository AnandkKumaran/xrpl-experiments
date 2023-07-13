
const xrpl = require('xrpl');
require('dotenv').config();

const client = new xrpl.Client(process.env.RIPPLE_API);
async function main(receiver, amount) {

    await client.connect();

    try {
        await client.getXrpBalance(receiver);
    } catch (error) {
        if (Number(xrpl.xrpToDrops(amount)) < Number(10000000)) {
            console.log('Receivers account doesnt have enough XRP reserve, You need to send at least 10 XRP to activate the account');
            client.disconnect();
            return
        }        
    }

    // Prepare transaction -------------------------------------------------------
    const prepared = await client.autofill({
        TransactionType: 'Payment',
        Account: process.env.ADDRESS,
        Amount: xrpl.xrpToDrops(amount),
        Destination: receiver,
    });
    const maxLedger = prepared.LastLedgerSequence;

    const sendersBalance = Number(xrpl.xrpToDrops(await client.getXrpBalance(process.env.ADDRESS)));
    const preparedAmount = prepared.Amount;
    const preparedFee = xrpl.dropsToXrp(prepared.Fee);

    if (Number(sendersBalance - preparedAmount - preparedFee) < Number(xrpl.xrpToDrops(10))) {
        console.log('Transaction Declined, You have to keep atleast 10 XRP in your account as a reserve');
    } else {
        console.log('Prepared transaction instructions:', prepared);
        console.log('Transaction cost:', xrpl.dropsToXrp(prepared.Fee), 'XRP');
        console.log('Transaction expires after ledger:', maxLedger);

        // // Sign prepared instructions ------------------------------------------------
        const wallet = xrpl.Wallet.fromMnemonic(process.env.MNEMONIC);
        const signed = wallet.sign(prepared);
        console.log('Identifying hash:', signed.hash);
        console.log('Signed blob:', signed.tx_blob);



        console.log('Config transaction created');
        console.log({ prepared, signed });

        const result = await client.submitAndWait(signed.tx_blob);

        client.disconnect();
        
        console.log({result});
        console.log('View Transaction: ', process.env.RIPPLE_URL + signed.hash)

    }
}
// main(receiver, amount)
main('rwNM7teXGgvtr1EBfsp5Na2izv1EDogj7T', 10);