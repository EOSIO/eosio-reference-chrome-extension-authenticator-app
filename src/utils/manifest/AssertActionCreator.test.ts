import global from '__mocks__/global.mock'
import * as payloadData from '__mocks__/data.mock'
import * as manifestData from 'utils/manifest/__mocks__/manifestData.mock'

import * as hash from 'hash.js'
import * as eosjs from 'eosjs'
import { SignatureProviderRequestEnvelope } from 'eosjs-signature-provider-interface'
import { TextDecoder, TextEncoder } from 'text-encoding'

import * as getAssertAbiHex from 'contracts/eosio.assert.abi.hex'
import { TransactionInfo } from 'eos/Transaction'
import AssertActionCreator from 'utils/manifest/AssertActionCreator'
import { DappInfo } from 'utils/manifest/DappInfo'
import { clone } from 'utils/helpers'

describe('AssertActionCreator', () => {
  let assertActionCreator: AssertActionCreator
  let transactionInfo: TransactionInfo
  let requestEnvelope: SignatureProviderRequestEnvelope
  let dappInfo: DappInfo
  let expectedTransactionInfo: TransactionInfo
  let expectedRequestEnvelope: SignatureProviderRequestEnvelope

  beforeEach(() => {
    global.TextEncoder = TextEncoder
    global.TextDecoder = TextDecoder

    jest.spyOn(eosjs, 'Api').mockImplementation(() => ({
      transactionTypes: jest.fn(),
      serialize: jest.fn(),
    }))

    jest.spyOn(hash, 'sha256').mockImplementation(() => ({
      update: () => ({
        digest: () => 'SHA256Hash',
      }),
    }))

    jest.spyOn(getAssertAbiHex, 'default').mockReturnValue('hex3')

    dappInfo = clone(manifestData.dappInfo)
    requestEnvelope = clone(payloadData.transactionSignatureRequest)
    transactionInfo = clone(payloadData.transactionWithMultipleActions)

    assertActionCreator = new AssertActionCreator()

    const assertAction = {
      account: 'eosio.assert',
      name: 'require',
      authorization: [
        {
          actor: 'actor1',
          permission: 'active',
        },
      ],
      data: {
        abi_hashes: [
          'SHA256Hash',
        ],
        actions: [
          {
            action: 'action1',
            contract: 'account.one',
          },
          {
            action: 'action2',
            contract: 'account.one',
          },
        ],
        chain_params_hash: 'SHA256Hash',
        manifest_id: 'SHA256Hash',
      },
    }

    expectedTransactionInfo = clone(transactionInfo)
    expectedTransactionInfo.actions = [...transactionInfo.actions, assertAction]

    const expectedAbis = [
      {
        abi: 'hex',
        accountName: 'account.one',
      },
      {
        abi: 'hex2',
        accountName: 'account.one',
      },
      {
        abi: 'hex3',
        accountName: 'eosio.assert',
      },
    ]

    expectedRequestEnvelope = clone(requestEnvelope)
    expectedRequestEnvelope.request.transactionSignature.abis = expectedAbis
  })

  describe('addAssertAction', () => {
    it('returns the assert action with the assert action added', async () => {
      const result = assertActionCreator.transactionWithAssertAction({
        dappInfo,
        transactionBundle: {
          transactionInfo,
          requestEnvelope,
        },
      })
      expect(result).toEqual({
        transactionInfo: expectedTransactionInfo,
        requestEnvelope: expectedRequestEnvelope,
      })
    })

    it('returns the assert action with the authorizations unioned', async () => {
      const updatedTransferAction = {
        account: 'account.one',
        name: 'action1',
        authorization: [
          {
            actor: 'actor2',
            permission: 'active',
          },
        ],
        data: {
          from: 'actor2',
          to: 'actor1',
          quantity: '1.0000 EOS',
          memo: 'Memo',
        },
      }
      transactionInfo.actions[0] = updatedTransferAction
      expectedTransactionInfo.actions[0] = updatedTransferAction
      expectedTransactionInfo.actions[2].authorization = [
        {
          actor: 'actor2',
          permission: 'active',
        },
        {
          actor: 'actor1',
          permission: 'active',
        },
      ]
      const result = assertActionCreator.transactionWithAssertAction({
        transactionBundle: {
          requestEnvelope,
          transactionInfo,
        },
        dappInfo,
      })
      expect(result).toEqual({
        transactionInfo: expectedTransactionInfo,
        requestEnvelope: expectedRequestEnvelope,
      })
    })

    it('returns the assert action with unique abi hashes only', () => {
      const newAccountAction = {
        account: 'eosio',
        name: 'newaccount',
        authorization: [
          {
            actor: 'actor1',
            permission: 'active',
          },
        ],
        data: {
          creator: 'actor1',
          name: 'actor2',
          owner: 'ownerPublicKey',
          active: 'activePublicKey',
        },
      }
      transactionInfo.actions.push(newAccountAction)
      requestEnvelope.request.transactionSignature.abis.push(
        {
          // tslint:disable-next-line:max-line-length
          abi: 'hex3',
          accountName: 'eosio',
        },
      )

      const assertAction = {
        account: 'eosio.assert',
        name: 'require',
        authorization: [
          {
            actor: 'actor1',
            permission: 'active',
          },
        ],
        data: {
          abi_hashes: [
            'SHA256Hash',
            'SHA256Hash',
          ].sort(),
          actions: [
            {
              action: 'action1',
              contract: 'account.one',
            },
            {
              action: 'action2',
              contract: 'account.one',
            },
            {
              action: 'newaccount',
              contract: 'eosio',
            },
          ],
          chain_params_hash: 'SHA256Hash',
          manifest_id: 'SHA256Hash',
        },
      }
      const expectedActions = [...transactionInfo.actions, assertAction]
      expectedTransactionInfo = payloadData.transactionWithMultipleActions
      expectedTransactionInfo.actions = expectedActions

      expectedRequestEnvelope.request.transactionSignature.abis.splice(2, 0,
        {
          abi: 'hex3',
          accountName: 'eosio',
        },
      )

      const result = assertActionCreator.transactionWithAssertAction({
        dappInfo,
        transactionBundle: {
          transactionInfo,
          requestEnvelope,
        },
      })
      expect(result).toEqual({
        transactionInfo: expectedTransactionInfo,
        requestEnvelope: expectedRequestEnvelope,
      })
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})
