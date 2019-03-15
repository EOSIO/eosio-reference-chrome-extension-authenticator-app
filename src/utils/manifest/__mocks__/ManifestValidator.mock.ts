import * as ManifestValidator from 'utils/manifest/ManifestValidator'

export const validateAppMetadata = jest.fn()
export const validateChainManifest = jest.fn()
export const validateTransaction = jest.fn()
export const transactionWithAssertAction = jest.fn()

jest.spyOn(ManifestValidator, 'default').mockImplementation(() => ({
  validateAppMetadata,
  validateChainManifest,
  validateTransaction,
  transactionWithAssertAction,
}))
