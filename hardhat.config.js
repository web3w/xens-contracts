require("@nomicfoundation/hardhat-toolbox");
require('@nomiclabs/hardhat-truffle5');
require("hardhat-abi-exporter");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
require('hardhat-gas-reporter');
const { accounts } = require("../secrets.json");


const accountList = [
  accounts["0x36B1a29E0bbD47dFe9dcf7380F276e86da90c4c2"],
  accounts["0x6E339d654815c6d79727f1b94b77d85863eB3659"]
]
real_accounts = undefined;
if (process.env.OWNER_KEY) {
  real_accounts = [process.env.OWNER_KEY];
}

module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.8.17',
        settings: {
          optimizer: {
            enabled: true,
            runs: 10000,
          },
        },
      },
    ],
  },
  gasReporter: {
    enabled: true  // 启用 gasReporter 插件
  },
  abiExporter: {
    path: './build/contracts',
    clear: true,
    flat: true,
    spacing: 2
  },
  networks: {
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_ID}`,
      tags: ["test", "use_root"],
      chainId: 5,
      accounts: real_accounts,
      // gasPrice: 30567057697 // 如果线上拥堵可能要调高gas
    },
    ethwmainnet: {
      url: `https://mainnet.ethereumpow.org`,
      tags: ["use_root"],
      chainId: 10001,
      accounts: real_accounts
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_ID}`,
      tags: ["use_root"],
      chainId: 1,
      accounts: real_accounts,
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_ID}`,
      chainId: 4,
      accounts: real_accounts,
    }
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    owner: {
      default: 0, //先默认同一个
    },
    visitor: {
      default: 2
    }
  },
};
