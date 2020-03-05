const { Application, genesisBlockDevnet, configDevnet } = require('lisk-sdk');
const CashbackTransaction = require('./cashback_transaction');

configDevnet.app.label = 'Cashback-blockchain-app';

const app = new Application(genesisBlockDevnet, configDevnet);

app.registerTransaction(CashbackTransaction);

app
	.run()
	.then(() => app.logger.info('App started...'))
	.catch(error => {
		console.error('Faced error in application', error);
		process.exit(1);
	});
