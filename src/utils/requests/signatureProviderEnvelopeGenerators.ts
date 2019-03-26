import {
  SignatureProviderResponseEnvelope,
  Transaction as SignedTransaction,
  ErrorResponse,
  Authorizer,
  envelopeDataType,
  EnvelopeDataType,
  SignatureProviderEnvelope,
} from 'eosjs-signature-provider-interface'

import {
  checkIfInstallationType,
  INSTALLATION_CHECK_ACTION,
} from 'utils/requests/installationCheckRequestHelpers'

export const createErrorResponseEnvelope = (
  envelope: SignatureProviderEnvelope,
  error: ErrorResponse,
): SignatureProviderResponseEnvelope => {
  const { id } = envelope

  // TODO: add checkInstallation to envelopeDataTypes
  let dataType = envelopeDataType(envelope) as any
  // TODO: remove once checkInstallation type is added
  dataType = dataType ? dataType : checkIfInstallationType(envelope)

  switch (dataType) {
  case EnvelopeDataType.TRANSACTION_SIGNATURE:
    return createTransactionSignatureResponseEnvelope(id, {
      signatures: [],
      packedTrx: '',
      packedContextFreeData: '',
      compression: 0,
    }, error)
  case EnvelopeDataType.SELECTIVE_DISCLOSURE:
    return createSelectiveDisclosureResponseEnvelope(id, [], error)
    // TODO: replace with EnvelopeDataType.INSTALLATION_CHECK_ACTION
  case INSTALLATION_CHECK_ACTION:
    return createInstallationCheckResponseEnvelope(id, error)
  default:
    return null
  }
}

export const createTransactionSignatureResponseEnvelope = (
  id: string,
  signedTransaction: SignedTransaction,
  error?: ErrorResponse,
): SignatureProviderResponseEnvelope => ({
  id,
  deviceKey: '',
  response: {
    transactionSignature: {
      signedTransaction,
      ...(error && { error }),
    },
  },
})

export const createSelectiveDisclosureResponseEnvelope = (
  id: string,
  authorizers: Authorizer[],
  error?: ErrorResponse,
): SignatureProviderResponseEnvelope => ({
  id,
  deviceKey: '',
  response: {
    selectiveDisclosure: {
      authorizers,
      ...(error && { error }),
    },
  },
})

export const createInstallationCheckResponseEnvelope = (
  id: string,
  error?: ErrorResponse,
): SignatureProviderResponseEnvelope => ({ // TODO: Add installation check to response envelope
  id,
  deviceKey: '',
  response: {
    installationCheck: {
      ...(error && { error }),
    },
  },
}) as SignatureProviderResponseEnvelope
