import * as data from '__mocks__/data.mock'

import {
  instanceOfInstallValidationRequestEnvelope,
  instanceOfInstallValidationResponseEnvelope,
  checkIfInstallationType,
  SignatureProviderRequestWithInstallationCheck,
  SignatureProviderResponseWithInstallationCheck,
  SignatureProviderRequestEnvelopeWithInstallationCheck,
  SignatureProviderResponseEnvelopeWithInstallationCheck,
} from './installationCheckRequestHelpers'
import { clone } from 'utils/helpers'

describe('instanceOfInstallValidationRequestEnvelope', () => {
  let requestEnvelope: SignatureProviderRequestEnvelopeWithInstallationCheck

  beforeEach(() => {
    jest.resetAllMocks()

    requestEnvelope = clone(data.installationCheckRequest)
  })

  it('returns true for a valid installationCheck RequestEnvelope configuration', () => {
    expect(instanceOfInstallValidationRequestEnvelope(requestEnvelope)).toBe(true)
  })

  it('returns true for a valid installationCheck RequestEnvelope configuration', () => {
    const request: SignatureProviderRequestWithInstallationCheck =
      requestEnvelope.request as SignatureProviderRequestWithInstallationCheck
    delete request.installationCheck
    request.installationCheck = {}
    expect(instanceOfInstallValidationRequestEnvelope(requestEnvelope)).toBe(true)
  })

  it('returns false for an invalid RequestEnvelope configuration that is not an object', () => {
    const str: SignatureProviderRequestEnvelopeWithInstallationCheck = 'not an object' as any
    expect(instanceOfInstallValidationRequestEnvelope(str)).toBe(false)
  })

  it('returns false for an invalid RequestEnvelope configuration with missing id', () => {
    delete requestEnvelope.id
    expect(instanceOfInstallValidationRequestEnvelope(requestEnvelope)).toBe(false)
  })

  it('returns false for an invalid RequestEnvelope configuration with missing declaredDomain', () => {
    delete requestEnvelope.declaredDomain
    expect(instanceOfInstallValidationRequestEnvelope(requestEnvelope)).toBe(false)
  })

  it('returns false for an invalid RequestEnvelope configuration with missing returnUrl', () => {
    delete requestEnvelope.returnUrl
    expect(instanceOfInstallValidationRequestEnvelope(requestEnvelope)).toBe(false)
  })

  it('returns false for an invalid RequestEnvelope configuration with missing request', () => {
    delete requestEnvelope.request
    expect(instanceOfInstallValidationRequestEnvelope(requestEnvelope)).toBe(false)
  })

  it('returns false for an invalid RequestEnvelope configuration with missing request type', () => {
    const request: SignatureProviderRequestWithInstallationCheck =
      requestEnvelope.request as SignatureProviderRequestWithInstallationCheck
    delete request.installationCheck
    expect(instanceOfInstallValidationRequestEnvelope(requestEnvelope)).toBe(false)
  })
})

describe('instanceOfInstallValidationResponseEnvelope', () => {
  let responseEnvelope: SignatureProviderResponseEnvelopeWithInstallationCheck

  beforeEach(() => {
    jest.resetAllMocks()

    responseEnvelope = clone(data.installationCheckResponse)
  })

  it('returns true for a valid installationCheck ResponseEnvelope configuration', () => {
    expect(instanceOfInstallValidationResponseEnvelope(responseEnvelope)).toBe(true)
  })

  it('returns true for a valid installationCheck ResponseEnvelope configuration', () => {
    const response: SignatureProviderResponseWithInstallationCheck =
      responseEnvelope.response as SignatureProviderResponseWithInstallationCheck
    delete response.installationCheck
    response.installationCheck = {}
    expect(instanceOfInstallValidationResponseEnvelope(responseEnvelope)).toBe(true)
  })

  it('returns false for an invalid ResponseEnvelope configuration that is not an object', () => {
    const str: SignatureProviderResponseEnvelopeWithInstallationCheck = 'not an object' as any
    expect(instanceOfInstallValidationResponseEnvelope(str)).toBe(false)
  })

  it('returns false for an invalid ResponseEnvelope configuration with missing id', () => {
    delete responseEnvelope.id
    expect(instanceOfInstallValidationResponseEnvelope(responseEnvelope)).toBe(false)
  })
})

describe('checkIfInstallationType', () => {
  let envelope: SignatureProviderRequestEnvelopeWithInstallationCheck
    | SignatureProviderResponseEnvelopeWithInstallationCheck

  it('returns correct installationCheck type for valid request', () => {
    envelope = clone(data.installationCheckRequest)
    expect(checkIfInstallationType(envelope)).toEqual('installationCheck')
  })

  it('returns correct installationCheck type for valid response', () => {
    envelope = clone(data.installationCheckResponse)
    expect(checkIfInstallationType(envelope)).toEqual('installationCheck')
  })

  it('returns \'null\' for a different type', () => {
    envelope = { request: { selectiveDisclosure: {} } } as any
    expect(checkIfInstallationType(envelope)).toEqual(null)
  })
})
