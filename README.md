# eos-wallet-js-v2

[eosjs-api](./eosjs-api.md)

# 简介

该版本为`scatterjs-plugin-eosjs2`对应的scatter的最新版本

对于早期版本的库，请使用: [eos-wallet-js](https://github.com/yuanjunliang/eos-wallet-js)

两个版本的区别:

```
scatterjs-plugin-eosjs     // For using eosjs@16.0.9 and below
scatterjs-plugin-eosjs2    // For using eosjs@beta and up
```

## 使用方法

- 安装

```
npm install eos-wallet-js-v2 --save
```
或
```
yarn add eos-wallet-js-v2
```

- 使用

```
const network = {
    blockchain:'eos',
    protocol:'https',
    host:'api.eosbeijing.one',
    port:443,
    chainId:"aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906"
}

const config = {
    dappName:"dapp",        // required:true
    initTimeout:5000,       // required:false default:5000 connect to scatter timeout
    to:"yuanjunliang"
}

import EOSWallet from 'eos-wallet-js-v2'
// create wallet
const Wallet = EOSWallet(network,config)
```

**注:**

**以下所有接口都支持Promise和async/await的方式调用**

- connect

```
// connect to wallet
Wallet.connect((connected)=>{})
```

- getIdentity

```
// get account identity
Wallet.getIdentity((error,account)=>{
	console.log(error,account)
})
```


- pushTransaction

```
// pushTransaction : call contract method
// 该方法用于调用一些智能合约接口
let action = {
    actions: [{
      account: 'eosio.token',
      name: 'transfer',
      authorization: [{
        actor: 'useraaaaaaaa',
        permission: 'active',
      }],
      data: {
        from: 'useraaaaaaaa',
        to: 'useraaaaaaab',
        quantity: '0.0001 SYS',
        memo: '',
      },
    }]
}

let blocksBehind = {
    blocksBehind: 3,
    expireSeconds: 30,
}

let params = [action,blocksBehind]
Wallet.pushTransaction(params,(error,response)=>{})
```

- eosjs api

```
// 其他eosjs api方法,查看eos模块
Wallet.eos
```

eosjs api 接口调用方法请参考:https://eosio.github.io/eosjs/
