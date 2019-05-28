import { SignatureProviderRequestEnvelope } from 'eosjs-signature-provider-interface'

import { TransactionInfo } from 'eos/Transaction'

export default interface DappRequest {
  transactionInfo?: TransactionInfo
  requestEnvelope: SignatureProviderRequestEnvelope
  requestError?: string
  newRequest?: boolean
}
