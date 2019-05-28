import { Api as EosApi, JsonRpc, RpcInterfaces, Serialize } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import {
  HexAbi,
  arrayToHex,
  Transaction as SignedTransaction,
} from 'eosjs-signature-provider-interface'

import AbiProvider from 'eos/AbiProvider'
import AuthorityProvider from 'eos/AuthorityProvider'
import { TransactionInfo, AbiInfo } from 'eos/Transaction'

export default class Api {
  private rpc: JsonRpc
  private abiProvider: AbiProvider
  private authorityProvider: AuthorityProvider
  private chainId: string

  constructor(abis: HexAbi[], publicKeys: string[], chainId: string) {
    this.rpc = new JsonRpc(null) // provide null chainURL to ensure vault isn't reaching out to chain for info
    this.abiProvider = new AbiProvider(abis)
    this.authorityProvider = new AuthorityProvider(publicKeys)
    this.chainId = chainId
  }

  /**
   * Signs a given transaction with given private key without broadcasting
   * @param {Object} transaction - JSON formatted object with transaction details
   * @param {String[]} privateKeys - array of private keys which should be used to sign the transaction
   * @return {Promise} The resultant payload from transact eosjs call (signed tx or error)
   */
  public async signTx(transaction: TransactionInfo, privateKeys: string[]): Promise<SignedTransaction> {
    const signatureProvider = new JsSignatureProvider(privateKeys)
    const api = new EosApi({
      rpc: this.rpc,
      signatureProvider,
      chainId: this.chainId,
      abiProvider: this.abiProvider,
      authorityProvider: this.authorityProvider,
    })
    const response: RpcInterfaces.PushTransactionArgs = await api.transact(transaction, { broadcast: false })
    return {
      signatures: response.signatures,
      packedTrx: arrayToHex(response.serializedTransaction),
      compression: 0,
      packedContextFreeData: '',
    }
  }

  /**
   * Deserializes a transaction hex string into a JSON object
   * @param {String} transactionHex - hex value string representing packed transaction with TAPOS
   * @return {Promise} The resultant JSON blob representing the hex transaction
   */
  public async deserialize(transactionHex: string): Promise<TransactionInfo> {
    const signatureProvider = new JsSignatureProvider([])
    const api = new EosApi({
      rpc: this.rpc,
      signatureProvider,
      chainId: this.chainId,
      abiProvider: this.abiProvider,
    })
    return api.deserializeTransactionWithActions(transactionHex)
  }

  /**
   * Takes in an array of abis as hex strings and returns the json version
   * @param abis Array of objects containing hex abis
   * @returns Array of abis as json
   */
  public decodeAbis(abis: HexAbi[]): AbiInfo[] {
    const signatureProvider = new JsSignatureProvider([])
    const api = new EosApi({
      rpc: this.rpc,
      signatureProvider,
      chainId: null,
      abiProvider: this.abiProvider,
    })
    return abis.map(({ abi, ...rest }) => {
      const uInt8Abi = Serialize.hexToUint8Array(abi)
      return { abi: api.rawAbiToJson(uInt8Abi), ...rest }
    })
  }
}
