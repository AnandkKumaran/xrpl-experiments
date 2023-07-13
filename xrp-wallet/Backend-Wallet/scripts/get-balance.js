const xrpl = require('xrpl');
require('dotenv').config();

const client = new xrpl.Client(process.env.RIPPLE_API);

async function main() {
    await client.connect();
    const balance = await client.getXrpBalance(process.env.ADDRESS);
    client.disconnect();
    console.log({ balance })
}

main();

