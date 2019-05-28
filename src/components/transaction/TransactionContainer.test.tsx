import '__mocks__/chrome.mock'
import * as apiMocks from 'utils/__mocks__/Api.mock'
import * as windowManagerMocks from 'utils/__mocks__/WindowManager.mock'
import * as dappMessengerMocks from 'utils/__mocks__/DappMessenger.mock'
import * as encrypter from 'utils/__mocks__/encrypter.mock'
import * as securityExclusionMocks from 'utils/manifest/__mocks__/SecurityExclusion.mock'
import * as data from '__mocks__/data.mock'

import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { SignatureProviderResponseEnvelope, ErrorCodes } from 'eosjs-signature-provider-interface'

import { TransactionContainer, mapStateToProps, ERROR_MESSAGES } from './TransactionContainer'
import TransactionRoutes from './TransactionRoutes'
import TXStatus from 'constants/txStatus'
import DappRequest from 'utils/requests/DappRequest'
import { createErrorResponseEnvelope } from 'utils/requests/signatureProviderEnvelopeGenerators'
import Auth from 'utils/Auth'
import { clone } from 'utils/helpers'
import { InsecureMode } from 'utils/insecureMode/InsecureMode'
import RoutePath from 'constants/routePath'

describe('TransactionContainer', () => {
  let transactionContainer: ShallowWrapper
  let request: DappRequest
  let auths: Auth[]
  let insecureMode: InsecureMode
  let canAccept: boolean
  let history: any
  let location: any
  let match: any

  const responseEnvelope: SignatureProviderResponseEnvelope = {
    id: 'requestId',
    deviceKey: '',
    response: {
      transactionSignature: {
        signedTransaction: {
          signatures: [
            'SIG_K1_ThisIsATestSignature',
          ],
          compression: 0,
          packedContextFreeData: '',
          packedTrx: '',
        },
      },
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()

    history = {
      push: jest.fn(),
    }
    location = {}
    match = {}

    auths = [{
      encryptedPrivateKey: 'encryptedPrivateKey',
      nickname: 'name',
      publicKey: 'publicKey1',
    }, {
      encryptedPrivateKey: 'encryptedPrivateKey2',
      nickname: 'name2',
      publicKey: 'otherPublicKey',
    }]

    request = {
      transactionInfo: clone(data.transactionWithSingleAction),
      requestEnvelope: clone(data.transactionSignatureRequest),
    }

    canAccept = true

    insecureMode = {
      enabled: false,
      whitelist: [],
    }

    securityExclusionMocks.shouldValidate.mockImplementation((
      securityMeasure,
      securityExclusions,
      insecureModeData,
      rootUrl,
    ) => {
      if (securityMeasure === 'relaxedContractParsing'
      && securityExclusions === request.requestEnvelope.securityExclusions
      && insecureModeData === insecureMode
      && rootUrl === 'http://domain.one') {
        return false
      }
      return true
    })

    apiMocks.decodeAbis.mockImplementation((abis: any[]) => abis)

    encrypter.decrypt.mockImplementation((encryptedPrivateKey, passphrase) => (
      encryptedPrivateKey.replace('encrypted', '')
    ))

    dappMessengerMocks.sendMessage.mockReset()
  })

  describe('construction', () => {
    beforeEach(() => {
      transactionContainer = shallowRenderTransactionContainer()
    })

    it('correctly sets initial state of the component', () => {
      transactionContainer.instance()

      expect(transactionContainer.state()).toEqual({
        txStatus: TXStatus.PENDING,
        canAccept,
      })
    })
  })

  describe('componentDidMount', () => {
    it('sends transaction info error if there is no transaction info', () => {
      request.transactionInfo = null
      shallowRenderTransactionContainer().instance().componentDidMount()
      const errorResponse = createErrorResponseEnvelope(request.requestEnvelope, {
        reason: ERROR_MESSAGES.NO_TRANSACTION_INFO,
        errorCode: ErrorCodes.transactionError,
        contextualInfo: '',
      })

      expect(dappMessengerMocks.sendMessage).toHaveBeenCalledWith(errorResponse)
      expect(windowManagerMocks.closeCurrentWindow).toHaveBeenCalledTimes(1)
    })

    it('sends actions error if there are no actions', () => {
      request.transactionInfo.actions = null
      shallowRenderTransactionContainer().instance().componentDidMount()
      const errorResponse = createErrorResponseEnvelope(request.requestEnvelope, {
        reason: ERROR_MESSAGES.NO_ACTIONS,
        errorCode: ErrorCodes.transactionError,
        contextualInfo: '',
      })

      expect(dappMessengerMocks.sendMessage).toHaveBeenCalledWith(errorResponse)
      expect(windowManagerMocks.closeCurrentWindow).toHaveBeenCalledTimes(1)
    })

    it('sends ABIs error if there are no ABIs', () => {
      request.requestEnvelope.request.transactionSignature.abis = null
      shallowRenderTransactionContainer().instance().componentDidMount()
      const errorResponse = createErrorResponseEnvelope(request.requestEnvelope, {
        reason: ERROR_MESSAGES.NO_ABIS,
        errorCode: ErrorCodes.transactionError,
        contextualInfo: '',
      })

      expect(dappMessengerMocks.sendMessage).toHaveBeenCalledWith(errorResponse)
      expect(windowManagerMocks.closeCurrentWindow).toHaveBeenCalledTimes(1)
    })

    it('doesnt send error message if expected data is there', () => {
      shallowRenderTransactionContainer().instance().componentDidMount()

      expect(dappMessengerMocks.sendMessage).not.toHaveBeenCalled()
      expect(windowManagerMocks.closeCurrentWindow).not.toHaveBeenCalled()
    })
  })

  describe('populating', () => {
    beforeEach(() => {
      transactionContainer = shallowRenderTransactionContainer()
    })

    describe('with an invalid transaction', () => {
      beforeEach(() => {
        transactionContainer.find(TransactionRoutes).prop('onTransactionError')('error')
      })

      it('posts a message to the dapp', () => {
        expect(dappMessengerMocks.sendMessage).toHaveBeenCalledWith(
          createErrorResponseEnvelope(request.requestEnvelope, {
            reason: 'error',
            errorCode: ErrorCodes.transactionError,
            contextualInfo: '',
          }),
        )
        expect(windowManagerMocks.closeCurrentWindow).toHaveBeenCalled()
      })
    })

    it('renders the TransactionRoutes correctly', () => {
      const state = {
        canAccept: true,
        txStatus: TXStatus.CANCELLED,
      }

      transactionContainer.setState(state)

      /* tslint:disable:no-string-literal */
      expect(transactionContainer.find(TransactionRoutes).props()).toEqual({
        ...state,
        onTransactionSign: transactionContainer.instance()['onTransactionSign'],
        onTransactionCancel: transactionContainer.instance()['onTransactionCancel'],
        onTransactionError: transactionContainer.instance()['onTransactionError'],
        onSetCanAccept: transactionContainer.instance()['onSetCanAccept'],
        onConfirmPassphrase: transactionContainer.instance()['onConfirmPassphrase'],
        onFailPassphrase: transactionContainer.instance()['onFailPassphrase'],
      })
      /* tslint:enable:no-string-literal */
    })

    describe('when the user', () => {
      describe('sets canAccept to true', () => {
        it('updates state.canAccept to true', () => {
          transactionContainer.setState({ canAccept: false })

          transactionContainer.find(TransactionRoutes).prop('onSetCanAccept')(true)

          expect(transactionContainer.state('canAccept')).toBe(true)
        })
      })

      describe('rejects a transaction', () => {
        beforeEach(() => {
          transactionContainer.find(TransactionRoutes).prop('onTransactionCancel')()
        })

        it('routes to the transaction cancelled page', () => {
          expect(history.push).toHaveBeenCalledWith(RoutePath.TRANSACTION_CANCELLED)
        })

        it('posts a message to the dapp', () => {
          expect(dappMessengerMocks.sendMessage).toHaveBeenCalledWith(
            createErrorResponseEnvelope(request.requestEnvelope, {
              reason: 'The transaction was cancelled by the specified authority',
              errorCode: ErrorCodes.signingError,
              contextualInfo: '',
            }),
          )
          expect(windowManagerMocks.closeCurrentWindow).toHaveBeenCalled()
        })
      })

      describe('signs a transaction', () => {
        describe('with an error', () => {
          beforeEach(async () => {
            auths = [{
              encryptedPrivateKey: 'newEncryptedPrivateKey',
              nickname: 'newName',
              publicKey: 'newKey',
            }]
            const errorMessage = 'signing failed'
            apiMocks.signTx.mockReturnValue(Promise.reject(new Error(errorMessage)))

            await transactionContainer.find(TransactionRoutes).prop('onConfirmPassphrase')('blahblah')
          })

          it('posts a message to the dapp', () => {
            expect(dappMessengerMocks.sendMessage).toHaveBeenCalledWith(
              createErrorResponseEnvelope(request.requestEnvelope, {
                reason: 'signing failed',
                errorCode: ErrorCodes.transactionError,
                contextualInfo: '',
              }),
            )
            expect(windowManagerMocks.closeCurrentWindow).toHaveBeenCalled()
          })
        })

        describe('with the wrong passphrase', () => {
          beforeEach(async () => {
            auths = [{
              encryptedPrivateKey: 'newEncryptedPrivateKey',
              nickname: 'newName',
              publicKey: 'newKey',
            }]

            await transactionContainer.find(TransactionRoutes).prop('onFailPassphrase')()
          })

          it('posts a message to the dapp', () => {
            expect(dappMessengerMocks.sendMessage).toHaveBeenCalledWith(
              createErrorResponseEnvelope(request.requestEnvelope, {
                reason: 'Failed to authenticate',
                errorCode: ErrorCodes.transactionError,
                contextualInfo: '',
              }),
            )
            expect(windowManagerMocks.closeCurrentWindow).toHaveBeenCalled()
          })
        })

        beforeEach(async () => {
          auths = [{
            encryptedPrivateKey: 'newEncryptedPrivateKey',
            nickname: 'newName',
            publicKey: 'newKey',
          }]
          apiMocks.signTx.mockReturnValue(Promise.resolve(data.signedTransaction))

          await transactionContainer.find(TransactionRoutes).prop('onTransactionSign')()
          await transactionContainer.find(TransactionRoutes).prop('onConfirmPassphrase')('blahblah')
        })

        it('routes the user to the confirm passphrase page', () => {
          expect(history.push).toHaveBeenCalledWith(RoutePath.TRANSACTION_CONFIRM_PASSPHRASE)
        })

        it('routes the user to the transaction approved page', () => {
          expect(history.push).toHaveBeenCalledWith(RoutePath.TRANSACTION_APPROVED)
        })

        it('only decrypts the private keys for auths with matching public keys to the request', () => {
          expect(encrypter.decrypt).toHaveBeenCalledWith('encryptedPrivateKey', 'blahblah')
          expect(encrypter.decrypt).not.toHaveBeenCalledWith('encryptedPrivateKey2', 'passphrase')
        })

        it('posts a message to the dapp', () => {
          expect(dappMessengerMocks.sendMessage).toHaveBeenCalledWith(responseEnvelope)
          expect(windowManagerMocks.closeCurrentWindow).toHaveBeenCalled()
        })
      })
    })
  })

  describe('mapStateToProps', () => {
    let state: any

    describe('transaction with a single action', () => {
      beforeEach(() => {
        state = {
          request: {
            data: request,
          },
          auths: {
            data: auths,
          },
        }
      })

      it('correctly sets canAccept', () => {
        expect(mapStateToProps(state as any).canAccept).toEqual(true)
      })
    })

    describe('transaction with a single action', () => {
      beforeEach(() => {
        request.transactionInfo = data.transactionWithMultipleActionsAndAssertRequire

        state = {
          request: {
            data: request,
          },
          auths: {
            data: auths,
          },
        }
      })

      it('correctly sets canAccept', () => {
        expect(mapStateToProps(state as any).canAccept).toEqual(false)
      })
    })

    describe('props', () => {
      beforeEach(() => {
        state = {
          request: {
            data: request,
          },
          auths: {
            data: auths,
          },
        }
      })

      it('correctly sets props', () => {
        expect(mapStateToProps(state as any).requestEnvelope).toEqual(request.requestEnvelope)
        expect(mapStateToProps(state as any).transactionInfo).toEqual(request.transactionInfo)
        expect(mapStateToProps(state as any).auths).toEqual(auths)
      })
    })
  })

  const shallowRenderTransactionContainer = () => (
    shallow(
      <TransactionContainer
        requestEnvelope={request.requestEnvelope}
        transactionInfo={request.transactionInfo}
        auths={auths}
        canAccept={canAccept}
        history={history}
        location={location}
        match={match}
      />,
      { disableLifecycleMethods: true },
    )
  )
})
