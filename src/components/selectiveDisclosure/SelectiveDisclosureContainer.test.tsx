import '__mocks__/chrome.mock'
import * as dappMessengerMocks from 'utils/__mocks__/DappMessenger.mock'
import * as windowManagerMocks from 'utils/__mocks__/WindowManager.mock'
import * as manifestData from 'utils/manifest/__mocks__/manifestData.mock'
import * as data from '__mocks__/data.mock'

import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import {
  Authorizer,
  ErrorCodes,
  SignatureProviderRequestEnvelope,
} from 'eosjs-signature-provider-interface'

import {
  SelectiveDisclosureContainer,
  mapStateToProps,
} from 'components/selectiveDisclosure/SelectiveDisclosureContainer'
import SelectiveDisclosureView from 'components/selectiveDisclosure/SelectiveDisclosureView'
import { DappInfo } from 'utils/manifest/DappInfo'
import Auth from 'utils/Auth'
import {
  createErrorResponseEnvelope,
  createSelectiveDisclosureResponseEnvelope,
} from 'utils/requests/signatureProviderEnvelopeGenerators'

describe('SelectiveDisclosureContainer', () => {
  let selectiveDisclosureContainer: ShallowWrapper
  let requestEnvelope: SignatureProviderRequestEnvelope
  let id: string
  let authorizers: Authorizer[]
  let dappInfo: DappInfo
  let auths: Auth[]

  beforeEach(() => {
    dappMessengerMocks.sendMessage.mockReset()

    auths = [{
      encryptedPrivateKey: 'encryptedPrivateKey',
      nickname: 'name',
      publicKey: 'publicKey',
    }, {
      encryptedPrivateKey: 'encryptedPrivateKey2',
      nickname: 'name2',
      publicKey: 'publicKey2',
    }]

    dappInfo = manifestData.dappInfo

    requestEnvelope = data.transactionSignatureRequest

    id = 'requestId'

    authorizers = [{
      publicKey: 'publicKey',
    }, {
      publicKey: 'publicKey2',
    }]

    selectiveDisclosureContainer = shallow(
      <SelectiveDisclosureContainer
        auths={auths}
        dappInfo={dappInfo}
        requestEnvelope={requestEnvelope}
      />,
    )
  })

  describe('user accepts the request', () => {
    beforeEach(() => {
      selectiveDisclosureContainer.find(SelectiveDisclosureView).prop('onAccept')()
    })

    it('posts a message to the dapp with the auths', () => {
      expect(dappMessengerMocks.sendMessage).toHaveBeenCalledWith(
        createSelectiveDisclosureResponseEnvelope(id, authorizers),
      )
      expect(windowManagerMocks.closeCurrentWindow).toHaveBeenCalled()
    })
  })

  describe('user denies the request', () => {
    beforeEach(() => {
      selectiveDisclosureContainer.find(SelectiveDisclosureView).prop('onDeny')()
    })

    it('posts a message to the dapp with the error', () => {
      expect(dappMessengerMocks.sendMessage).toHaveBeenCalledWith(
        createErrorResponseEnvelope(requestEnvelope, {
          reason: 'The request was denied by the specified authority',
          errorCode: ErrorCodes.unexpectedError,
          contextualInfo: '',
        }),
      )
      expect(windowManagerMocks.closeCurrentWindow).toHaveBeenCalled()
    })
  })

  it('gets the request prop from the redux state', () => {
    const state = {
      request: {
        data: {
          requestEnvelope: 'requestEnvelope',
        },
      },
      dappInfo: {
        data: 'dappInfo',
      },
      auths: {
        data: 'auths',
      },
    }

    expect(mapStateToProps(state as any).requestEnvelope).toEqual('requestEnvelope')
    expect(mapStateToProps(state as any).dappInfo).toEqual('dappInfo')
    expect(mapStateToProps(state as any).auths).toEqual('auths')
  })
})
