import {
  SignatureProviderResponseEnvelope,
  SignatureProviderRequestEnvelope,
  SignatureProviderRequest,
  SignatureProviderResponse,
} from 'eosjs-signature-provider-interface'

export const INSTALLATION_CHECK_ACTION = 'installationCheck'

export interface InstallationCheckRequest {
  installationCheck: {}
}

export interface SignatureProviderRequestWithInstallationCheck extends Partial<InstallationCheckRequest> {}

export interface SignatureProviderRequestEnvelopeWithInstallationCheck
  extends Pick<SignatureProviderRequestEnvelope,
    Exclude<keyof SignatureProviderRequestEnvelope, 'request'>
  > {
  request: SignatureProviderRequest | SignatureProviderRequestWithInstallationCheck
}

export interface InstallationCheckResponse {
  installationCheck: {}
}

export interface SignatureProviderResponseWithInstallationCheck extends Partial<InstallationCheckResponse> {}

export interface SignatureProviderResponseEnvelopeWithInstallationCheck
  extends Pick<SignatureProviderResponseEnvelope,
    Exclude<keyof SignatureProviderResponseEnvelope, 'response'>
  > {
  response: SignatureProviderResponse | SignatureProviderResponseWithInstallationCheck
}

export const instanceOfInstallValidationRequestEnvelope =
  (requestEnvelope: SignatureProviderRequestEnvelopeWithInstallationCheck): boolean => {
    if (!instanceOfObject(requestEnvelope)) { return false }
    return hasRequiredKeys(requestEnvelope, ['id', 'declaredDomain', 'returnUrl', 'request'])
    && INSTALLATION_CHECK_ACTION in requestEnvelope.request
  }

export const instanceOfInstallValidationResponseEnvelope =
  (responseEnvelope: SignatureProviderResponseEnvelopeWithInstallationCheck): boolean => {
    if (!instanceOfObject(responseEnvelope)) { return false }
    return hasRequiredKeys(responseEnvelope, ['id', 'response'])
    && INSTALLATION_CHECK_ACTION in responseEnvelope.response
  }

const instanceOfObject = (data: any): data is object => {
  return typeof data === 'object' && data != null
}

const hasRequiredKeys = (object: object, keys: string[]): boolean => {
  return keys.every((key: string) => key in object)
}

export const checkIfInstallationType = (envelope: any): string => {
  if (!instanceOfInstallValidationRequestEnvelope(envelope) && !instanceOfInstallValidationResponseEnvelope(envelope)) {
    return null
  } else {
    return INSTALLATION_CHECK_ACTION
  }
}
