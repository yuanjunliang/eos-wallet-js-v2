# eosjs-api

该API主要封装了eosjs的一些API接口

[TOC]

使用方法

**所有方法都是返回Promise**

```
import { EosApi } from 'eos-wallet-js-v2'
const config = {
    httpEndpoint: 'https://jungle3.cryptolions.io',
};

const api = EosApi(config)
```

- getInfo

```
api.getInfo()
```

- getAccount

```
api.getAccount(accountName)
```

- getBlock

```
api.getBlock(blockNumOrId)
```

- getAbi

```
api.getAbi(accountName)
```

- getCurrencyBalance 

```
api.getCurrencyBalance({
    code: '',
    account: '',
    symbol: ''
})
```

- getTableByScope

```
api.getTableByScope({
    "code": "string",    // required
    "table": "string",
    "lower_bound": "string",
    "upper_bound": "string",
    "limit": 10,
    "reverse": false,
    "show_payer": false
})
```

- getTableRows

```
api.getTableRows({
    "code": "string",       // required
    "table": "string",      // required
    "scope": "string",      // required
    "index_position": "string",
    "key_type": "string",
    "encode_type": "string",
    "lower_bound": "string",
    "upper_bound": "string",
    "limit": 10,
    "reverse": false,
    "show_payer": false
})
```

## 参考文档

- [API Reference](https://developers.eos.io/manuals/eos/latest/nodeos/plugins/chain_api_plugin/api-reference/index#operation/get_account)
- [eosjs-api](https://github.com/EOSIO/eosjs-api)