import * as data from '__mocks__/data.mock'

import {
  SignatureProviderResponseEnvelope,
  SignatureProviderEnvelope,
} from 'eosjs-signature-provider-interface'

import './signatureProviderEnvelopeGenerators'
import {
  createErrorResponseEnvelope,
  createInstallationCheckResponseEnvelope,
} from './signatureProviderEnvelopeGenerators'

describe('errorEnvelopeGenerator', () => {
  let expectedSelectiveDisclosureError: SignatureProviderResponseEnvelope
  let expectedTransactionSignatureError: SignatureProviderResponseEnvelope
  let expectedCheckInstallationError: SignatureProviderResponseEnvelope

  beforeEach(() => {
    expectedTransactionSignatureError = {
      id: data.transactionSignatureRequest.id,
      deviceKey: '',
      response: {
        transactionSignature: {
          signedTransaction: {
            signatures: [],
            compression: 0,
            packedContextFreeData: '',
            packedTrx: '',
          },
          error: {
            reason: 'Invalid request',
            errorCode: 2,
            contextualInfo: '',
          },
        },
      },
    }

    expectedSelectiveDisclosureError = {
      id: data.selectiveDisclosureRequest.id,
      deviceKey: '',
      response: {
        selectiveDisclosure: {
          authorizers: [],
          error: {
            reason: 'Invalid request',
            errorCode: 2,
            contextualInfo: '',
          },
        },
      },
    }

    expectedCheckInstallationError = {
      id: data.selectiveDisclosureRequest.id,
      deviceKey: '',
      response: {
        installationCheck: {
          error: {
            reason: 'Invalid request',
            errorCode: 2,
            contextualInfo: '',
          },
        },
      },
    } as SignatureProviderResponseEnvelope
  })

  it('should generate a transactionSignature error', () => {
    const errorEnvelope = createErrorResponseEnvelope(data.transactionSignatureRequest, {
      reason: 'Invalid request',
      errorCode: 2,
      contextualInfo: '',
    })
    expect(errorEnvelope).toEqual(expectedTransactionSignatureError)
  })

  it('should generate a selectiveDisclosure error envelope', () => {
    const errorEnvelope = createErrorResponseEnvelope(data.selectiveDisclosureRequest, {
      reason: 'Invalid request',
      errorCode: 2,
      contextualInfo: '',
    })
    expect(errorEnvelope).toEqual(expectedSelectiveDisclosureError)
  })

  it('should generate a installationCheck response envelope', () => {
    const responseEnvelope = createInstallationCheckResponseEnvelope(data.installationCheckRequest.id)
    expect(responseEnvelope).toEqual(data.installationCheckResponse)
  })

  it('should generate a installationCheck error envelope', () => {
    const errorEnvelope = createErrorResponseEnvelope(data.installationCheckRequest as SignatureProviderEnvelope, {
      reason: 'Invalid request',
      errorCode: 2,
      contextualInfo: '',
    })
    expect(errorEnvelope).toEqual(expectedCheckInstallationError)
  })

  it('should return null if not a correct envelope data type', () => {
    const errorEnvelope = createErrorResponseEnvelope({
      id: 'id',
      version: 'version',
      declaredDomain: 'domain',
      returnUrl: 'domain',
      request: {},
    }, {
      reason: 'Invalid request',
      errorCode: 2,
      contextualInfo: '',
    })
    expect(errorEnvelope).toEqual(null)
  })
})
