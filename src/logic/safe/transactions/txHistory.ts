import { MultisigTransactionRequest, proposeTransaction, TransactionDetails } from '@gnosis.pm/safe-react-gateway-sdk'

import { GnosisSafe } from 'src/types/contracts/gnosis_safe.d'
import { _getChainId } from 'src/config'

import { checksumAddress } from 'src/utils/checksumAddress'
import { GATEWAY_URL } from 'src/utils/constants'
import { TxArgs } from '../store/models/types/transaction'
import axios from 'axios'

type ProposeTxBody = Omit<MultisigTransactionRequest, 'safeTxHash'> & {
  safeInstance: GnosisSafe
  data: string | number[]
}

const calculateBodyFrom = async ({
  safeInstance,
  to,
  value,
  data,
  operation,
  nonce,
  safeTxGas,
  baseGas,
  gasPrice,
  gasToken,
  refundReceiver,
  sender,
  origin,
  signature,
}: ProposeTxBody): Promise<MultisigTransactionRequest> => {
  const safeTxHash = await safeInstance.methods
    .getTransactionHash(to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver || '', nonce)
    .call()

  return {
    to: checksumAddress(to),
    value,
    data,
    operation,
    nonce: nonce.toString(),
    safeTxGas: safeTxGas.toString(),
    baseGas: baseGas.toString(),
    gasPrice,
    gasToken,
    refundReceiver,
    safeTxHash,
    sender: checksumAddress(sender),
    origin,
    signature,
  }
}

type SaveTxToHistoryTypes = TxArgs & { origin?: string | null; signature?: string }

export const saveTxToHistory = async ({
  baseGas,
  data,
  gasPrice,
  gasToken,
  nonce,
  operation,
  origin,
  refundReceiver,
  safeInstance,
  safeTxGas,
  sender,
  signature,
  to,
  valueInWei,
}: SaveTxToHistoryTypes): Promise<TransactionDetails> => {
  const address = checksumAddress(safeInstance.options.address)
  const body = await calculateBodyFrom({
    safeInstance,
    to,
    value: valueInWei,
    data,
    operation,
    nonce: nonce.toString(),
    safeTxGas,
    baseGas,
    gasPrice,
    gasToken,
    refundReceiver,
    sender,
    origin: origin ? origin : null,
    signature,
  })
  console.log('saveTxToHistory')
  let txDetails
  if (_getChainId() === '1666600000') {
    const response = await axios.post(
      'https://multisig.t.hmny.io/api/v1/safes/0x7689573A24F5c1cbb4DCabbcE591Ba4D9bad6a12/transactions/?has_confirmations=True',
      {
        ...body,
        contractTransactionHash: body.safeTxHash,
      },
    )
    txDetails = response.data
  } else {
    txDetails = await proposeTransaction(GATEWAY_URL, _getChainId(), address, body)
  }
  return txDetails
}
