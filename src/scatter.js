import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs2';
import { Api, JsonRpc } from 'eosjs';

ScatterJS.plugins(new ScatterEOS());

export default class Wallet {
  constructor(network, config) {
    this.eos = null;
    this.network = network;
    this.config = config;
    this.rpc = null;
    this.scatterNetwork = null;
    this.init();
  }

  init() {
    this.scatterNetwork = ScatterJS.Network.fromJson(this.network);
    this.rpc = new JsonRpc(this.scatterNetwork.fullhost());
  }

  async connect(callback) {
    const dappName = this.config.dappName || 'dapp';
    const network = this.scatterNetwork;
    if (typeof callback === 'function') {
      const connected = await ScatterJS.scatter.connect(dappName, { network });
      callback(connected);
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
}
