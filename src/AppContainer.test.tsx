import '__mocks__/chrome.mock'
import 'utils/__mocks__/encrypter.mock'
import * as dappMessengerMocks from 'utils/__mocks__/DappMessenger.mock'
import * as data from '__mocks__/data.mock'

import * as React from 'react'
import { shallow } from 'enzyme'
import { ErrorCodes, EnvelopeDataType } from 'eosjs-signature-provider-interface'

import { AppContainer, mapDispatchToProps } from './AppContainer'
import RoutePath from 'constants/routePath'
import { createErrorResponseEnvelope } from 'utils/requests/signatureProviderEnvelopeGenerators'
import DappRequest from 'utils/requests/DappRequest'
import { clone } from 'utils/helpers'
import { DelayedRemovable } from 'store/AppState'
import Auth from 'utils/Auth'
import * as authsActions from 'store/auths/authsActions'

describe('AppContainer', () => {
  let history: any
  let passphrase: string
  let request: DappRequest
  let auths: Array<DelayedRemovable<Auth>>
  let dispatch: jest.Mock
  let authDelayedRemove: jest.Mock

  beforeEach(async () => {
    jest.clearAllMocks()

    history = {
      replace: jest.fn(),
    }

    passphrase = 'phrase'

    auths = [
      {
        nickname: 'nickname1',
        publicKey: 'publicKey1',
        encryptedPrivateKey: 'encryptedPrivateKey1',
      },
      {
        nickname: 'nickname2',
        publicKey: 'publicKey2',
        encryptedPrivateKey: 'encryptedPrivateKey2',
        removing: true,
      },
      {
        nickname: 'nickname3',
        publicKey: 'publicKey3',
        encryptedPrivateKey: 'encryptedPrivateKey3',
        removing: true,
      }
    ]

    dispatch = jest.fn()
    authDelayedRemove = jest.fn()
  })

  describe('construction', () => {
    beforeEach(() => {
      shallowRenderAppContainer()
    })

    it('starts delayed removal of auths marked for removal', () => {
      expect(authDelayedRemove).not.toHaveBeenCalledWith('publicKey1')
      expect(authDelayedRemove).toHaveBeenCalledWith('publicKey2')
      expect(authDelayedRemove).toHaveBeenCalledWith('publicKey3')
    })
  })

  describe('route', () => {
    describe('no action', () => {
      beforeEach(() => {
        const requestEnvelope = clone(data.transactionSignatureRequest)
        requestEnvelope.request = {}
        request =  {
          requestEnvelope,
        }

        shallowRenderAppContainer()
      })

      it('routes to the auths route with no animation', () => {
        expect(history.replace).toHaveBeenCalledWith(RoutePath.AUTHS, { skipAnimation: true })
      })
    })

    describe('no passphrase', () => {
      beforeEach(() => {
        request = {
          requestEnvelope: data.transactionSignatureRequest,
        }
        passphrase = null
        shallowRenderAppContainer()
      })

      it('routes to the create passphrase route with no animation', () => {
        expect(history.replace).toHaveBeenCalledWith(RoutePath.CREATE_PASSPHRASE, { skipAnimation: true })
      })
    })

    describe('when the request has an error', () => {
      beforeEach(() => {
        request =  {
          requestEnvelope: data.transactionSignatureRequest,
          requestError: 'error',
        }

        shallowRenderAppContainer()
      })

      it('routes to the error route with no animation', () => {
        expect(history.replace).toHaveBeenCalledWith(RoutePath.ERROR, { skipAnimation: true })
      })
    })

    describe(`the ${EnvelopeDataType.SELECTIVE_DISCLOSURE} action`, () => {
      beforeEach(() => {
        request = {
          requestEnvelope: data.selectiveDisclosureRequest,
        }

        shallowRenderAppContainer()
      })

      it('routes to the selective disclosure route with no animation', () => {
        expect(history.replace).toHaveBeenCalledWith(RoutePath.SELECTIVE_DISCLOSURE, { skipAnimation: true })
      })
    })

    describe(`the ${EnvelopeDataType.TRANSACTION_SIGNATURE} action`, () => {
      beforeEach(() => {
        request = {
          requestEnvelope: data.transactionSignatureRequest,
        }

        shallowRenderAppContainer()
      })

      it('routes to the transaction route with no animation', () => {
        expect(history.replace).toHaveBeenCalledWith(RoutePath.TRANSACTION, { skipAnimation: true })
      })
    })
  })

  describe('closing the extension window', () => {
    beforeEach(() => {
      dappMessengerMocks.sendMessage.mockReset()
      window.addEventListener = jest.fn((eventName, callback) => {
        if (eventName === 'beforeunload') {
          callback()
        }
      })
    })

    it('sends a message back to the dapp if there is a requestEnvelope', () => {
      request = {
        requestEnvelope: data.transactionSignatureRequest,
      }

      shallowRenderAppContainer()

      expect(dappMessengerMocks.sendMessage).toHaveBeenCalledWith(
        createErrorResponseEnvelope(request.requestEnvelope, {
          reason: 'The action was rejected because the user closed the window.',
          errorCode: ErrorCodes.unexpectedError, // TODO: Probably need some error code for "expected" error
          contextualInfo: '',
        }),
      )
    })

    it('should not send a message to the dapp if there is no requestEnvelope', () => {
      request = null

      shallowRenderAppContainer()

      expect(dappMessengerMocks.sendMessage).not.toHaveBeenCalled()
    })
  })

  it('maps authDelayedRemove prop to authDelayedRemove action', () => {
    const { authDelayedRemove: dispatchAuthDelayedRemove } = mapDispatchToProps(dispatch)

    jest.spyOn(authsActions, 'authDelayedRemove').mockReturnValue('action')

    dispatchAuthDelayedRemove('publicKey')
    expect(dispatch).toHaveBeenCalledWith('action')
  })

  const shallowRenderAppContainer = () => {
    return shallow(
      <AppContainer
        history={history}
        request={request}
        passphraseHash={passphrase}
        auths={auths}
        authDelayedRemove={authDelayedRemove}
        location={null}
        match={null}
      />,
    )
  }
})
