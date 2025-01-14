/*
 * LiskHQ/lisk-commander
 * Copyright © 2021 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 *
 */

// import * as modules from '../../../src/app/modules/hello'

import { helloCounterSchema, CHAIN_STATE_HELLO_COUNTER } from "./assets/create_hello_asset.spec";
import { CreateHelloAsset } from '../../../../src/app/modules/hello/assets/create_hello_asset';
import { testing, StateStore, codec, TokenTransferAsset } from 'lisk-sdk';
import { HelloModule } from '../../../../src/app/modules/hello/hello_module';

describe('HelloModule', () => {
    let helloModule: HelloModule = new HelloModule(testing.fixtures.defaultConfig.genesisConfig);
    let asset = { helloString: "Hello test" };
    let account = testing.fixtures.defaultFaucetAccount;
    let transferAsset = { amount: "100000000", recipientAddress: account.address, data: "" };
    let stateStore: StateStore;
    let context;
    let channel = testing.mocks.channelMock;
    let validTestTransaction;
    let invalidTestTransaction;

    helloModule.init({
        channel: channel,
        logger: testing.mocks.loggerMock,
        dataAccess: new testing.mocks.DataAccessMock(),
    });

    validTestTransaction = testing.createTransaction({
        moduleID: 1000,
        assetClass: CreateHelloAsset,
        asset,
        nonce: BigInt(0),
        fee: BigInt('10000000'),
        passphrase: account.passphrase,
        networkIdentifier: Buffer.from(
            'e48feb88db5b5cf5ad71d93cdcd1d879b6d5ed187a36b0002cc34e0ef9883255',
            'hex',
        ),
    });

    invalidTestTransaction = testing.createTransaction({
        moduleID: 2,
        assetClass: TokenTransferAsset,
        asset: transferAsset,
        nonce: BigInt(0),
        fee: BigInt('10000000'),
        passphrase: account.passphrase,
        networkIdentifier: Buffer.from(
            'e48feb88db5b5cf5ad71d93cdcd1d879b6d5ed187a36b0002cc34e0ef9883255',
            'hex',
        ),
    });

    beforeEach(() => {
        stateStore = new testing.mocks.StateStoreMock({
            chain: { "hello:helloCounter": codec.encode(helloCounterSchema,  { helloCounter: 0 })}
        });

        jest.spyOn(channel, 'publish');
        jest.spyOn(stateStore.chain, 'get');
        jest.spyOn(stateStore.chain, 'set');
    });

	describe('afterTransactionApply', () => {
        it('should publish a new event for each applied hello transaction.', async () => {
            context = testing.createTransactionApplyContext ({
                transaction: validTestTransaction,
            });

            await helloModule.afterTransactionApply(context);

            expect(channel.publish).toHaveBeenCalledWith("hello:newHello", {
                sender: account.address.toString('hex'),
                hello: asset.helloString
            });
        });
        it('should not publish a new event for each applied other transaction (not hello).', async () => {
            context = testing.createTransactionApplyContext ({
                transaction: invalidTestTransaction,
            });

            await helloModule.afterTransactionApply(context);

            expect(channel.publish).not.toBeCalled();
        });
	});
	describe('afterGenesisBlockApply', () => {
		it('should set the hello counter to zero', async () => {
            context = testing.createAfterGenesisBlockApplyContext ({
                stateStore: stateStore,
            });

            await helloModule.afterGenesisBlockApply(context);

            expect(stateStore.chain.set).toHaveBeenCalledWith(
                CHAIN_STATE_HELLO_COUNTER,
                codec.encode(helloCounterSchema, { helloCounter: 0 })
            );
        });
	});
	describe('amountOfHellos', () => {
		it('should return the absolute amount of sent hello transactions', async () => {

		    stateStore.chain.set(CHAIN_STATE_HELLO_COUNTER,
                codec.encode(helloCounterSchema, { helloCounter: 13 })
            );
            const helloCounter = await helloModule.actions.amountOfHellos();
            expect(helloCounter).toEqual(13);
        });
	});
});
