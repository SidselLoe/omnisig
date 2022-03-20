import { ChainInfo, getChainsConfig, RPC_AUTHENTICATION } from '@gnosis.pm/safe-react-gateway-sdk'
import { setWeb3ReadOnly } from 'src/logic/wallets/getWeb3'
import { GATEWAY_URL } from 'src/utils/constants'

// Cache is required as loading Redux store directly is an anit-pattern
let chains: ChainInfo[] = []

export const getChains = (): ChainInfo[] => chains

export const loadChains = async () => {
  console.log('loadChains')
  var { results = [] } = await getChainsConfig(GATEWAY_URL)

  const harmony = {
    transactionService: 'https://multisig.t.hmny.io/api/v1',
    chainId: '1666600000',
    chainName: 'Harmony',
    shortName: 'one',
    l2: false,
    description: '',
    rpcUri: {
      authentication: 'API_KEY_PATH',
      value: 'https://api.harmony.one/',
    },
    safeAppsRpcUri: {
      authentication: 'API_KEY_PATH',
      value: 'https://api.harmony.one/',
    },
    publicRpcUri: {
      authentication: 'API_KEY_PATH',
      value: 'https://api.harmony.one/',
    },
    blockExplorerUriTemplate: {
      address: 'https://etherscan.io/address/{{address}}',
      txHash: 'https://etherscan.io/tx/{{txHash}}',
      api: 'https://api.etherscan.io/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}',
    },
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      logoUri: 'https://safe-transaction-assets.staging.gnosisdev.com/chains/1/currency_logo.png',
    },
    theme: {
      textColor: '#001428',
      backgroundColor: '#DDDDDD',
    },
    ensRegistryAddress: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    gasPrice: [
      {
        type: 'ORACLE',
        uri: 'https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=JNFAU892RF9TJWBU3EV7DJCPIWZY8KEMY1',
        gasParameter: 'FastGasPrice',
        gweiFactor: '1000000000.000000000',
      },
      {
        type: 'ORACLE',
        uri: 'https://ethgasstation.info/json/ethgasAPI.json?api-key=8bb8066b5c3ed1442190d0e30ad9126c7b8235314397efa76e6977791cb2',
        gasParameter: 'fast',
        gweiFactor: '100000000.000000000',
      },
    ],
    disabledWallets: ['lattice'],
    features: [
      'CONTRACT_INTERACTION',
      'DOMAIN_LOOKUP',
      'EIP1559',
      'ERC721',
      'SAFE_APPS',
      'SAFE_TX_GAS_OPTIONAL',
      'SPENDING_LIMIT',
    ],
  } as unknown as ChainInfo
  results.push(harmony)
  chains = results
  // Set the initail web3 provider after loading chains
  console.log('chains')
  console.log(chains)
  setWeb3ReadOnly()
}

// An empty template is required because `getChain()` uses `find()` on load
export const emptyChainInfo: ChainInfo = {
  transactionService: '',
  chainId: '',
  chainName: '',
  shortName: '',
  l2: false,
  description: '',
  rpcUri: { authentication: '' as RPC_AUTHENTICATION, value: '' },
  publicRpcUri: { authentication: '' as RPC_AUTHENTICATION, value: '' },
  safeAppsRpcUri: { authentication: '' as RPC_AUTHENTICATION, value: '' },
  blockExplorerUriTemplate: {
    address: '',
    txHash: '',
    api: '',
  },
  nativeCurrency: {
    name: '',
    symbol: '',
    decimals: 0,
    logoUri: '',
  },
  theme: { textColor: '', backgroundColor: '' },
  ensRegistryAddress: '',
  gasPrice: [],
  disabledWallets: [],
  features: [],
}
