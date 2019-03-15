import * as ManifestProvider from 'utils/manifest/ManifestProvider'

export const getChainManifest = jest.fn()
export const getChainManifests = jest.fn()
export const getAppMetadataInfo = jest.fn()
export const getDappInfo = jest.fn()

export const manifestProviderMock = {
  getChainManifest,
  getChainManifests,
  getAppMetadataInfo,
  getDappInfo,
  rootUrl: 'http://domain.one',
}

jest.spyOn(ManifestProvider, 'default').mockImplementation(() => manifestProviderMock)
