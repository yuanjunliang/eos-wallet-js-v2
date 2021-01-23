import axios from 'axios';

const defaultConfig = {
  httpEndpoint: 'http://eospush.tokenpocket.pro',
};

export const URL = {
  GET_INFO: '/v1/chain/get_info',
  GET_ACCOUNT: '/v1/chain/get_account',
  GET_BLOCK: '/v1/chain/get_block',
  GET_ABI: '/v1/chain/get_abi',
  GET_CURRENCY_BALANCE: '/v1/chain/get_currency_balance',
  GET_TABLE_BY_SCOPE: '/v1/chain/get_table_by_scope',
  GET_TABLE_ROWS: '/v1/chain/get_table_rows',
};

class EosApi {
  constructor(config) {
    this.config = Object.assign({},defaultConfig,config);
    this.http = null;

    this.init();
  }

  init() {
    axios.defaults.baseURL = this.config.httpEndpoint;
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.interceptors.response.use((response) => response.data, (error) => Promise.reject(error));
    this.http = axios;
  }

  getInfo() {
    return this.http.post(URL.GET_INFO);
  }

  getAccount(accountName,callback) {
    if (typeof callback === 'function') {
      this.http.post(URL.GET_ACCOUNT, { account_name: accountName }).then(res=> {
        callback(null,res)
      }).catch(error=> {
        callback(error,null)
      })
    } else {
      return this.http.post(URL.GET_ACCOUNT, { account_name: accountName });
    }
  }

  getBlock(blockNumOrId) {
    return this.http.post(URL.GET_BLOCK, { block_num_or_id: blockNumOrId });
  }

  getAbi(accountName) {
    return this.http.post(URL.GET_ABI, { account_name: accountName });
  }

  /**
   * params: {
   *    code: string,
   *    account: string,
   *    symbol: string
   * }
   */
  getCurrencyBalance(params) {
    return this.http.post(URL.GET_CURRENCY_BALANCE, params);
  }

  getBalance (account,callback) {
    const params = {
      code: 'eosio.token',
      account: account,
      symbol: 'EOS',
    }
    if (typeof callback === 'function') {
      this.http.post(URL.GET_CURRENCY_BALANCE,params).then(res=> {
        callback(null,res)
      }).catch(error=> {
        callback(error,null)
      })
    } else {
      return this.http.post(URL.GET_CURRENCY_BALANCE,params)
    }
  }

  /**
   * params: {
   *    code: string,
   *    table: string,
   *    lower_bound: string,
   *    upper_bound: string,
   *    limit: string,
   *    reverse: string,
   *    show_payer: string
   * }
   */
  getTableByScope(params) {
    return this.http.post(URL.GET_TABLE_BY_SCOPE, params);
  }

  getTableRows(params) {
    return this.http.post(URL.GET_TABLE_ROWS, params);
  }
}

export default (config) => new EosApi(config);
