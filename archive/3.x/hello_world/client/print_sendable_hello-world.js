const HelloTransaction = require('../hello_transaction');
const { EPOCH_TIME } = require('@liskhq/lisk-constants');
const {getNetworkIdentifier} = require('@liskhq/lisk-cryptography');
const networkIdentifier = getNetworkIdentifier(
    "23ce0366ef0a14a91e5fd4b1591fc880ffbef9d988ff8bebf8f3666b0c09597d",
    "Lisk",
);

/**
 *  To directly send the printed transaction:
 *  > node print_sendable_hello-world.js | curl -X POST -H "Content-Type: application/json" -d @- localhost:4000/api/transactions
 *  Note: An node needs to run on port 4000 (the default one) before. If the node runs on a different port, adjust the query accordingly.
 */

const getTimestamp = () => {
    // check config file or curl localhost:4000/api/node/constants to verify your epoc time
    const millisSinceEpoc = Date.now() - Date.parse(EPOCH_TIME);
    const inSeconds = ((millisSinceEpoc) / 1000).toFixed(0);
    return  parseInt(inSeconds);
};

const tx = new HelloTransaction({
    asset: {
        hello: 'world',
    },
    networkIdentifier: networkIdentifier,
    timestamp: getTimestamp(),
});

tx.sign('creek own stem final gate scrub live shallow stage host concert they');

console.log(tx.stringify());
process.exit(0);
