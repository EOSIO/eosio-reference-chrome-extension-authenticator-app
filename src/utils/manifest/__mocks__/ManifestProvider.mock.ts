import * as ManifestProvider from 'utils/manifest/ManifestProvider'

export const getChainManifest = jest.fn()
export const getAppManifest = jest.fn()
export const getAppMetadataInfo = jest.fn()
export const getDappInfo = jest.fn()

export const manifestProviderMock = {
  getChainManifest,
  getAppManifest,
  getAppMetadataInfo,
  getDappInfo,
  rootUrl: 'http://domain.one',
}

jest.spyOn(ManifestProvider, 'default').mockImplementation(() => manifestProviderMock)
