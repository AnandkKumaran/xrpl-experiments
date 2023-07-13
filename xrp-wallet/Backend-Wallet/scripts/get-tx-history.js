const xrpl = require('xrpl');
require('dotenv').config();

const client = new xrpl.Client(process.env.RIPPLE_API);

async function main() {
    await client.connect();
    const history = await client.request({
        command: 'account_tx',
        account: process.env.ADDRESS,
    })
    client.disconnect();
    console.log({ history })

    // const [data] = result;
    const data = history.result;
    let historyObj = [];
    if (data.transactions.length > 0 && typeof (data.transactions) === 'object') {
        historyObj = data.transactions.map(uTx => ({
            sender: uTx.tx.Account,
            receiver: uTx.tx.Destination,
            value: uTx.tx.Amount / 1000000,
            timeStamp: (uTx.tx.date + 946684800) * 1000,
            transactedOn: new Date((uTx.tx.date + 946684800) * 1000),
            fee: uTx.tx.Fee,
            flags: uTx.tx.Flags,
            lastLedgerSequence: uTx.tx.LastLedgerSequence,
            sequence: uTx.tx.Sequence,
            transactionType: uTx.tx.TransactionType,
            hash: uTx.tx.hash,
            change: process.env.ADDRESS === uTx.tx.Account ? 'Sent' : 'Received',
            transType: process.env.ADDRESS === uTx.tx.Account ? 'Sent' : 'Received',
            transactionStatusUrl: process.env.RIPPLE_URL + uTx.tx.hash,
            transactionStatus: uTx.meta.TransactionResult === 'tesSUCCESS' ? 'Success' : 'Failure',
        }));
    }
    console.log(historyObj);
}

main();



