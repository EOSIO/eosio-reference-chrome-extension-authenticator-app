import * as manifestMocks from 'utils/manifest/__mocks__/manifestData.mock'

import * as hash from 'hash.js'

import ManifestProvider from 'utils/manifest/ManifestProvider'

const CHAIN_MANIFESTS_FILENAME = 'chain-manifests.json'

describe('ManifestProvider', () => {
  let manifestProvider: ManifestProvider
  let declaredDomain: string
  let windowFetchMock: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()

    windowFetchMock = jest.fn()
    window.fetch = windowFetchMock

    jest.spyOn(hash, 'sha256').mockImplementation(() => ({
      update: () => ({
        digest: () => 'hashed',
      }),
    }))

    declaredDomain = 'http://domain.one'
    manifestProvider = new ManifestProvider(declaredDomain)
  })

  describe('getChainManifest', () => {
    let chainId: string

    beforeEach(() => {
      chainId = manifestMocks.appManifest.manifests[0].chainId
    })

    describe('if the fetch is successful', () => {
      beforeEach(() => {
        windowFetchMock.mockReturnValue({
          ok: true,
          json: () => manifestMocks.appManifest,
        })
      })

      it('fetches the chain manifest from the correct URL', async () => {
        await manifestProvider.getChainManifest(chainId)

        expect(windowFetchMock)
          .toHaveBeenCalledWith(`http://domain.one/${CHAIN_MANIFESTS_FILENAME}`, expect.any(Object))
      })

      it('returns fetched chain manifest', async () => {
        const result = await manifestProvider.getChainManifest(chainId)

        expect(result).toEqual(manifestMocks.appManifest.manifests[0])
      })
    })

    describe('if the fetch fails', () => {
      beforeEach(() => {
        windowFetchMock.mockReturnValue({
          ok: false,
        })
      })

      it('throws an error', async (done) => {
        try {
          await manifestProvider.getChainManifest(chainId)
        } catch (e) {
          return done()
        }

        done.fail('getChainManifest did not fail when fetch failed')
      })
    })

    describe('if there is a cached chain manifest', () => {
      beforeEach(() => {
        windowFetchMock.mockReturnValueOnce({
          ok: true,
          json: () => manifestMocks.appManifest,
        })
      })

      it('returns a cached chain manifest if called more than once', async () => {
        const result1 = await manifestProvider.getChainManifest(chainId)
        const result2 = await manifestProvider.getChainManifest(chainId)

        expect(windowFetchMock).toHaveBeenCalledTimes(1)
        expect(result1 === result2).toBe(true)
      })
    })
  })

  describe('getAppManifest', () => {
    describe('if the fetch is successful', () => {
      beforeEach(() => {
        windowFetchMock.mockReturnValue({
          ok: true,
          json: () => manifestMocks.appManifest,
        })
      })

      it('fetches the app manifest from the correct URL', async () => {
        await manifestProvider.getAppManifest()

        expect(windowFetchMock)
          .toHaveBeenCalledWith(`http://domain.one/${CHAIN_MANIFESTS_FILENAME}`, expect.any(Object))
      })

      it('returns fetched app manifest', async () => {
        const result = await manifestProvider.getAppManifest()

        expect(result).toEqual(manifestMocks.appManifest)
      })
    })

    describe('if the fetch fails', () => {
      beforeEach(() => {
        windowFetchMock.mockReturnValue({
          ok: false,
        })
      })

      it('throws an error', async (done) => {
        try {
          await manifestProvider.getAppManifest()
        } catch (e) {
          return done()
        }

        done.fail('getAppManifest did not fail when fetch failed')
      })
    })

    describe('if there is a cached app manifest', () => {
      beforeEach(() => {
        windowFetchMock.mockReturnValueOnce({
          ok: true,
          json: () => manifestMocks.appManifest,
        })
      })

      it('returns cached app manifest if called more than once', async () => {
        const result1 = await manifestProvider.getAppManifest()
        const result2 = await manifestProvider.getAppManifest()

        expect(windowFetchMock).toHaveBeenCalledTimes(1)
        expect(result1 === result2).toBe(true)
      })
    })
  })

  describe('getAppMetadataInfo', () => {
    let chainId: string

    beforeEach(() => {
      chainId = manifestMocks.appManifest.manifests[0].chainId
    })

    describe('if the fetch is successful', () => {
      beforeEach(() => {
        windowFetchMock.mockImplementation((url: string) => {
          if (url.indexOf(CHAIN_MANIFESTS_FILENAME) >= 0) {
            return {
              ok: true,
              json: () => manifestMocks.appManifest,
            }
          } else if (url.indexOf('app-metadata.json') >= 0) {
            return {
              ok: true,
              json: () => manifestMocks.appMetadata,
              clone: () => ({
                // return blob of string "app-metadata.json"
                blob: () => new Blob(['app-metadata.json'], { type: 'text/plain' }),
              }),
            }
          }
          return null
        })
      })

      it('fetches the app metadata from the correct URL', async () => {
        await manifestProvider.getAppMetadataInfo(chainId)

        expect(windowFetchMock)
          .toHaveBeenCalledWith('http://domain.one/app-metadata.json#SHA256Hash', expect.any(Object))
      })

      it('returns fetched app metadata info', async () => {
        const result = await manifestProvider.getAppMetadataInfo(chainId)

        expect(result).toEqual({
          appMetadata: manifestMocks.appMetadata,
          appMetadataHash: 'hashed',
        })
      })
    })

    describe('if the fetch fails', () => {
      beforeEach(() => {
        windowFetchMock.mockImplementation((url: string) => {
          if (url.indexOf(CHAIN_MANIFESTS_FILENAME) >= 0) {
            return {
              ok: true,
              json: () => manifestMocks.appManifest,
            }
          } else if (url.indexOf('app-metadata.json') >= 0) {
            return {
              ok: false,
            }
          }
          return null
        })
      })

      it('throws an error', async (done) => {
        try {
          await manifestProvider.getAppMetadataInfo(chainId)
        } catch (e) {
          return done()
        }

        done.fail('getAppMetadataInfo did not fail when fetch fails.')
      })
    })

    describe('if there is cached app metadata info', () => {
      beforeEach(() => {
        let hasFetched = false
        windowFetchMock.mockImplementation((url: string) => {
          if (url.indexOf(CHAIN_MANIFESTS_FILENAME) >= 0) {
            return {
              ok: true,
              json: () => manifestMocks.appManifest,
            }
          } else if (url.indexOf('app-metadata.json') >= 0 && !hasFetched) {
            hasFetched = true
            return {
              ok: true,
              json: () => manifestMocks.appMetadata,
              clone: () => ({
                // return blob of string "app-metadata.json"
                blob: () => new Blob(['app-metadata.json'], { type: 'text/plain' }),
              }),
            }
          }
          return null
        })
      })

      it('returns cached app metadata info if called more than once', async () => {
        const result1 = await manifestProvider.getAppMetadataInfo(chainId)
        const result2 = await manifestProvider.getAppMetadataInfo(chainId)

        expect(windowFetchMock).toHaveBeenCalledTimes(2)
        expect(result1).toEqual(result2)
      })
    })

    describe('if there is no chainId provided', () => {
      beforeEach(() => {
        windowFetchMock.mockImplementation((url: string) => {
          if (url.indexOf(CHAIN_MANIFESTS_FILENAME) >= 0) {
            return {
              ok: true,
              json: () => manifestMocks.appManifest,
            }
          } else if (url.indexOf('app-metadata.json') >= 0) {
            return {
              ok: true,
              json: () => manifestMocks.appMetadata,
              clone: () => ({
                // return blob of string "app-metadata.json"
                blob: () => new Blob(['app-metadata.json'], { type: 'text/plain' }),
              }),
            }
          }
          return null
        })
      })

      it('gets the chainId from the first chain in the chain manifests', async () => {
        await manifestProvider.getAppMetadataInfo()

        expect(windowFetchMock)
          .toHaveBeenCalledWith(`http://domain.one/app-metadata.json#SHA256Hash`, expect.any(Object))
      })

      it('fails if there are no chain manifests', async (done) => {
        windowFetchMock.mockReturnValue({
          ok: true,
          json: () => [] as any,
        })

        try {
          await manifestProvider.getAppMetadataInfo()
        } catch (e) {
          return done()
        }
        done.fail('getAppMetadataInfo did not fail for no chain manifests')
      })
    })
  })

  describe('getDappInfo', () => {
    let chainId: string

    beforeEach(() => {
      chainId = manifestMocks.appManifest.manifests[1].chainId

      windowFetchMock.mockImplementation((url: string) => {
        if (url.indexOf(CHAIN_MANIFESTS_FILENAME) >= 0) {
          return {
            ok: true,
            json: () => manifestMocks.appManifest,
          }
        } else if (url.indexOf('app-metadata.json') >= 0) {
          return {
            ok: true,
            json: () => manifestMocks.appMetadata,
            clone: () => ({
              // return blob of string "app-metadata.json"
              blob: () => new Blob(['app-metadata.json'], { type: 'text/plain' }),
            }),
          }
        }
        return null
      })
    })

    it('returns the correct dappInfo', async () => {
      const result = await manifestProvider.getDappInfo(chainId)

      expect(result).toEqual({
        appMetadataInfo: {
          appMetadata: manifestMocks.appMetadata,
          appMetadataHash: 'hashed',
        },
        chainManifest: manifestMocks.appManifest.manifests[1],
        rootUrl: 'http://domain.one',
      })
    })
  })

  describe('rootURL', () => {
    it('returns the root url from the declared domain', () => {
      manifestProvider = new ManifestProvider('http://test.domain.one/somePath')

      expect(manifestProvider.rootUrl).toEqual('http://test.domain.one')
    })
  })
})
