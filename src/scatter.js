import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs2';
import { Api, JsonRpc } from 'eosjs';
import EosApi from './api'
console.log({EosApi})

ScatterJS.plugins(new ScatterEOS());

export default class Wallet {
  constructor(network, config) {
    this.eos = null;
    this.connected = false
    this.account = null
    this.scatter = null
    this.network = network;
    this.config = config;
    this.rpc = null;
    this.scatterNetwork = null;
    this.init();
  }

  init() {
    this.scatterNetwork = ScatterJS.Network.fromJson(this.network);
    this.rpc = new JsonRpc(this.scatterNetwork.fullhost());

    if (this.config.httpEndpoint) {
      this.eosapi = EosApi(this.config)
    }
  }

  async connect(callback) {
    console.log("connect========",this.connected)
    const dappName = this.config.dappName || 'dapp';
    const network = this.scatterNetwork;
    if (typeof callback === 'function') {
      if (this.connected) {
        callback(true)
        return
      }
      const connected = await ScatterJS.scatter.connect(dappName, { network });
      this.connected = connected
      callback(connected);
      return
    }
    return ScatterJS.scatter.connect(dappName, { network });
  }

  // get account info
  async getIdentity(callback) {
    if (!this.connect) {
      throw Error('Please connect to scatter');
    }
    const network = this.scatterNetwork;
    const { rpc } = this;
    if (typeof callback === 'function') {
      try {
        const identity = await ScatterJS.login();
        console.log({ identity });
        if (!identity) {
          throw Error('no identity');
        }
        const account = ScatterJS.account('eos');
        this.eos = ScatterJS.eos(network, Api, { rpc, beta3: true });
        this.account = account;
        this.scatter = ScatterJS.scatter
        callback(null, account);
      } catch (error) {
        callback(error, null);
      }
    }

    return ScatterJS.login().then((identity) => {
      if (!identity) {
        throw Error('no identity');
      }
      const account = ScatterJS.account('eos');
      this.eos = ScatterJS.eos(network, Api, { rpc, beta3: true });
      this.account = account;
      return account;
    });
  }

  forgetIdentity () {
    this.eos = null
    this.connected = false
    this.account = null
    this.scatter.forgetIdentity()
  }

  // push eos action transaction
  pushTransaction(params, callback) {
    if (typeof callback === 'function') {
      this.eos.transact(...params)
        .then((res) => {
          callback(null, res);
        })
        .catch((error) => {
          callback(error, null);
        });
    }

    return this.eos.transact(...params);
  }

  // transfer eos
  transfer (params,callback) {
    const { to,quantity,memo } = params
    const action = {
      actions: [{
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
          actor: this.account.name,
          permission: this.account.authority,
        }],
        data: {
          from: this.account.name,
          to: to,
          quantity: `${quantity} EOS`,
          memo: memo,
        },
      }]
    }
    const blocksBehind = {
      blocksBehind: 3,
      expireSeconds: 30,
    }
    const p = [action,blocksBehind]
    return this.pushTransaction(p,callback)
  }

  // get eos balance
  getBalance ({accountName},callback) {
    return this.eosapi.getBalance(accountName,callback)
  }

  // get account info
  getAccount (accountName,callback) {
    return this.eosapi.getAccount(accountName,callback)
  }
}
