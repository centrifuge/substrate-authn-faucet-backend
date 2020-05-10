import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import config from '../config/config';
import {BN} from 'bn.js';
import * as ErrorStatus from '../constants/error-status';

const url = config.CFG_NETOWRK_URL;
const transfer_amount = config.CFG_TRANSFER_AMOUNT;

let pk = null;
let api = null;

const startup = async () => {
  const provider = new WsProvider(url);
  await cryptoWaitReady();
  const keyring = new Keyring();

  pk = keyring.addFromUri(config.CFG_HOT_WALLET_SEED, {}, 'sr25519');

  api = await ApiPromise.create({provider,types: {
    // mapping the actual specified address format
    Address: 'AccountId',
    // mapping the lookup
    LookupSource: 'AccountId'
  }});
};

startup();


export const hasFunds = async () => {
  const { balanceBN } = await walletBalance();
  const transferBN = new BN(transfer_amount);
  const requiredAmountBN = transferBN.div(new BN(100)).mul(new BN(110)); // need 10% more

  if(balanceBN.lt(requiredAmountBN)) throw new Error(ErrorStatus.INSUFFICIENT_FUNDS);
};

export const transfer =  async (recipient_address) => {
  // TODO: Check if the balance is sufficient before transfering the funds.

  const hash = await api.tx.balances.transfer(recipient_address, transfer_amount).signAndSend(pk);

  return hash;
};

export const walletBalance = async () => {
  // console.log('The hot wallet is : ', config.CFG_HOT_WALLET_SEED);

  // TODO: Check if the balance is sufficient before transfering the funds.
  // let ret = await api.query.system.account(pk.address);

  let { data: { free: previousFree } } = await api.query.system.account(pk.address);
  // console.log('Address : ', pk.address);

  return { balance: previousFree.toHuman(), balanceBN: previousFree};
};

