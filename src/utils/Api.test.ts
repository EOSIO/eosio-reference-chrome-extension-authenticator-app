import * as data from '__mocks__/data.mock'

import * as eosjs from 'eosjs'
import * as eosjsSignatureProvider from 'eosjs/dist/eosjs-jssig'
import * as SPI from 'eosjs-signature-provider-interface'

import Api from 'utils/Api'
import { TransactionInfo } from 'eos/Transaction'

describe('api', () => {
  let api: Api

  beforeEach(() => {
    const { abis, publicKeys, chainId } = data.transactionSignatureRequest.request.transactionSignature
    api = new Api(abis, publicKeys, chainId)
  })

  describe('signTx', () => {
    let transaction: TransactionInfo
    let transact: () => void
    let response: any

    beforeEach(async () => {
      transaction = data.transactionWithSingleAction

      transact = jest.fn().mockImplementation(() =>
        ({ signatures: [ 'signature1' ], serializedTransaction: [ 0, 1, 2 ]}))
      jest.spyOn(eosjs, 'Api').mockImplementation(() => ({ transact }))
      jest.spyOn(eosjsSignatureProvider, 'JsSignatureProvider').mockImplementation(() => ({ signatureProvider: '' }))

      jest.spyOn(SPI, 'arrayToHex').mockReturnValue('hexString')

      response = await api.signTx(transaction, ['privateKey1', 'privateKey2'])
    })

    it('configures the signature provider', () => {
      expect(eosjsSignatureProvider.JsSignatureProvider).toHaveBeenCalledWith(['privateKey1', 'privateKey2'])
    })

    it('signs the transaction', () => {
      expect(transact).toHaveBeenCalledWith(transaction, { broadcast: false })
    })

    it('returns the packed transaction and the signatures', () => {
      expect(response).toEqual({
        signatures: [ 'signature1' ],
        packedTrx: 'hexString',
        packedContextFreeData: '',
        compression: 0,
      })
    })
  })

  describe('deserialize', () => {
    let transactionHex: string
    let deserializeTransactionWithActions: () => void

    beforeEach(async () => {
      transactionHex = 'Example Transaction Hex'

      deserializeTransactionWithActions = jest.fn()
      jest.spyOn(eosjs, 'Api').mockImplementation(() => ({ deserializeTransactionWithActions }))

      await api.deserialize(transactionHex)
    })

    it('configures the signature provider without needing keys', () => {
      expect(eosjsSignatureProvider.JsSignatureProvider).toHaveBeenCalledWith([])
    })

    it('deserializes the transaction hex', () => {
      expect(deserializeTransactionWithActions).toHaveBeenCalledWith('Example Transaction Hex')
    })
  })

  describe('decodeAbis', ()  => {
    let abis: any
    let rawAbiToJson: () => void
    let jsonAbis: any

    beforeEach(() => {
      abis = [{ abi: 'hex', accountName: 'name' }, { abi: 'hex2', accountName: 'name2' }]

      jest.spyOn(eosjs.Serialize, 'hexToUint8Array').mockImplementation(() => 'uint8')

      rawAbiToJson = jest.fn().mockReturnValue('json')
      jest.spyOn(eosjs, 'Api').mockImplementation(() => ({ rawAbiToJson }))

      jsonAbis = api.decodeAbis(abis)
    })

    it('configures the signature provider without needing keys', () => {
      expect(eosjsSignatureProvider.JsSignatureProvider).toHaveBeenCalledWith([])
    })

    it('calls hexToUint8Array with abi field', () => {
      expect(eosjs.Serialize.hexToUint8Array).toHaveBeenCalledWith('hex')
      expect(eosjs.Serialize.hexToUint8Array).toHaveBeenCalledWith('hex2')
    })

    it('converts raw abis to json values', () => {
      expect(jsonAbis).toEqual([{ abi: 'json', accountName: 'name' }, { abi: 'json', accountName: 'name2' }])
    })
  })
})
