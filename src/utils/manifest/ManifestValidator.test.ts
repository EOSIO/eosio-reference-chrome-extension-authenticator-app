import '__mocks__/chrome.mock'
import * as payloadData from '__mocks__/data.mock'
import * as manifestData from 'utils/manifest/__mocks__/manifestData.mock'
import * as manifestProviderMocks from 'utils/manifest/__mocks__/ManifestProvider.mock'
import * as assertActionCreatorMocks from 'utils/manifest/__mocks__/AssertActionCreator.mock'
import * as insecureModeStorageMocks from 'utils/storage/__mocks__/InsecureModeStorage.mock'

import * as hash from 'hash.js'
import {
  SecurityExclusions,
  AppManifest,
  ChainManifest,
  AppMetadata
} from 'eosjs-signature-provider-interface'

import ManifestValidator, { ERROR_MESSAGES, FETCH_RESPONSE_ERROR } from 'utils/manifest/ManifestValidator'
import * as SecurityExclusionHelpers from 'utils/manifest/SecurityExclusion'
import { DappInfo } from 'utils/manifest/DappInfo'
import { TransactionInfo } from 'eos/Transaction'
import { clone } from 'utils/helpers'

describe('ManifestValidator', () => {
  let manifestValidator: ManifestValidator
  let securityExclusions: SecurityExclusions
  let manifestProvider: any
  let appMetadata: AppMetadata
  let appMetadataHash: string
  let transactionInfo: TransactionInfo
  let appManifest: AppManifest
  let chainManifest: ChainManifest
  let dappInfo: DappInfo
  let fetchMock: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()

    appMetadata = clone(manifestData.appMetadata)
    appMetadataHash = clone(manifestData.dappInfo.appMetadataInfo.appMetadataHash)
    appManifest = clone(manifestData.appManifest)
    chainManifest = appManifest.manifests[0]
    dappInfo = clone(manifestData.dappInfo)
    transactionInfo = clone(payloadData.transactionWithMultipleActions)
    securityExclusions = clone(payloadData.securityExclusions)
    manifestProvider = manifestProviderMocks.manifestProviderMock

    manifestProviderMocks.getAppMetadataInfo.mockResolvedValue({
      appMetadata,
      appMetadataHash,
    })
    manifestProvider.getChainManifest.mockResolvedValue(appManifest.manifests[0])
    manifestProvider.getAppManifest.mockResolvedValue(appManifest)
    manifestProvider.getDappInfo.mockResolvedValue(dappInfo)
    manifestProvider.rootUrl = 'http://domain.one'

    insecureModeStorageMocks.get.mockResolvedValue({})

    jest.spyOn(SecurityExclusionHelpers, 'shouldValidate').mockReturnValue(true)

    jest.spyOn(hash, 'sha256').mockImplementation(() => ({
      update: () => ({
        digest: () => 'SHA256Hash',
      }),
    }))

    fetchMock = jest.fn(() => ({
      ok: true,
      blob: async () => new Blob(['app-metadata.json'], { type: 'text/plain' }),
    }))
    window.fetch = fetchMock

    manifestValidator = new ManifestValidator({ manifestProvider, securityExclusions })
  })

  describe('validateAppMetadata', () => {
    describe('without security exclusions', () => {
      it('passes for a valid AppMetadata configuration', async (done) => {
        try {
          await manifestValidator.validateAppMetadata()
        } catch (e) {
          return done.fail(e.toString())
        }
        done()
      })

      it('passes for a valid AppMetadata configuration with a full HTTPS url for the icon', async (done) => {
        appMetadata.icon = 'https://domain.one/app-icon.png#SHA256Hash'

        try {
          await manifestValidator.validateAppMetadata()
        } catch (e) {
          return done.fail(e.toString())
        }
        done()
      })

      it('passes for a valid AppMetadata with an optional missing field', async (done) => {
        delete appMetadata.description

        try {
          await manifestValidator.validateAppMetadata()
        } catch (e) {
          return done.fail(e.toString())
        }
        done()
      })

      it('fails for an invalid AppMetadata configuration with a missing required field', async (done) => {
        delete appMetadata.name

        try {
          await manifestValidator.validateAppMetadata()
        } catch (e) {
          expect(e.message).toBe(ERROR_MESSAGES.INVALID_APP_METADATA_SCHEMA)
          return done()
        }
        done.fail('validateAppMetadata did not fail on missing required field')
      })

      it('fails if the app icon is an invalid url', async (done) => {
        appMetadata.icon = 'NOT VALID'

        try {
          await manifestValidator.validateAppMetadata()
        } catch (e) {
          expect(e.message).toBe(ERROR_MESSAGES.INVALID_FILE_URL('icon'))
          return done()
        }
        done.fail('validateAppMetadata did not fail on invalid app icon url')
      })

      it('fails for an app icon url missing its hash', async (done) => {
        appMetadata.icon = 'https://domain.one/app-icon.png'

        try {
          await manifestValidator.validateAppMetadata()
        } catch (e) {
          expect(e.message).toBe(ERROR_MESSAGES.MISSING_FILE_HASH('icon'))
          return done()
        }
        done.fail('validateAppMetadata did not fail on an app icon url missing a hash')
      })

      it('fails for an invalid AppMetadata configuration with an incorrect app icon hash', async (done) => {
        appMetadata.icon = 'http://domain.one/app-icon.png#WRONG_HASH'

        try {
          await manifestValidator.validateAppMetadata()
        } catch (e) {
          expect(e.message).toBe(ERROR_MESSAGES.MISMATCHED_FILE_HASH('icon'))
          return done()
        }
        done.fail('validateAppMetadata did not fail on an incorrect app icon hash')
      })

      it('fails if a chain icon is an invalid url', async (done) => {
        appMetadata.chains[0].icon = 'NOT VALID'

        try {
          await manifestValidator.validateAppMetadata()
        } catch (e) {
          expect(e.message).toBe(ERROR_MESSAGES.INVALID_FILE_URL('Chain One icon'))
          return done()
        }
        done.fail('validateAppMetadata did not fail on invalid chain icon url')
      })

      it('fails for a chain icon url missing its hash', async (done) => {
        appMetadata.chains[0].icon = 'https://domain.one/chain-icon.png'

        try {
          await manifestValidator.validateAppMetadata()
        } catch (e) {
          expect(e.message).toBe(ERROR_MESSAGES.MISSING_FILE_HASH('Chain One icon'))
          return done()
        }
        done.fail('validateAppMetadata did not fail on a chain icon url missing a hash')
      })

      it('fails for an invalid AppMetadata configuration with an incorrect chain icon hash', async (done) => {
        appMetadata.chains[0].icon = 'http://domain.one/chain-icon.png#WRONG_HASH'

        try {
          await manifestValidator.validateAppMetadata()
        } catch (e) {
          expect(e.message).toBe(ERROR_MESSAGES.MISMATCHED_FILE_HASH('Chain One icon'))
          return done()
        }
        done.fail('validateAppMetadata did not fail on an incorrect chain icon hash')
      })

      it('fails if an error is thrown while fetching the icon', async (done) => {
        const error = new Error('Host unreachable')
        fetchMock.mockImplementationOnce(() => {
          return Promise.reject(error)
        })

        try {
          await manifestValidator.validateAppMetadata()
        } catch (e) {
          expect(e.message).toBe(ERROR_MESSAGES.UNABLE_TO_FETCH('http://domain.one/app-icon.png', error))
          return done()
        }
        done.fail('validateAppMetadata did not fail on failed icon fetch')
      })

      it('fails if the response returns a failure code while fetching the icon', async (done) => {
        const response: Partial<Response> = {
          ok: false,
          status: 404,
          statusText: 'Not found',
        }
        fetchMock.mockImplementationOnce(() => {
          return Promise.resolve(response)
        })

        try {
          await manifestValidator.validateAppMetadata()
        } catch (e) {
          expect(e.message).toBe(
            ERROR_MESSAGES.UNABLE_TO_FETCH('http://domain.one/app-icon.png',
              FETCH_RESPONSE_ERROR(response as any),
            ),
          )
          return done()
        }
        done.fail('validateAppMetadata did not fail on fetch with failure code')
      })
    })

    describe('with security exclusions', () => {
      it('passes for an invalid metadata configuration if appMetadataIntegrity exclusion is active', async (done) => {
        jest.spyOn(SecurityExclusionHelpers, 'shouldValidate').mockImplementation((exclusion: string) => {
          return exclusion !== 'appMetadataIntegrity'
        })

        delete appMetadata.name

        try {
          await manifestValidator.validateAppMetadata()
        } catch (e) {
          return done.fail(e.toString())
        }
        done()
      })

      it('passes for an incorrect app icon hash if iconIntegrity exclusion is active', async (done) => {
        jest.spyOn(SecurityExclusionHelpers, 'shouldValidate').mockImplementation((exclusion: string) => {
          return exclusion !== 'iconIntegrity'
        })

        appMetadata.icon = 'http://domain.one/app-icon.png#WRONG_HASH'

        try {
          await manifestValidator.validateAppMetadata()
        } catch (e) {
          return done.fail(e.toString())
        }
        done()
      })

      it('passes for an incorrect chain icon hash if iconIntegrity exclusion is active', async (done) => {
        jest.spyOn(SecurityExclusionHelpers, 'shouldValidate').mockImplementation((exclusion: string) => {
          return exclusion !== 'iconIntegrity'
        })

        appMetadata.chains[0].icon = 'http://domain.one/chain-icon.png#WRONG_HASH'

        try {
          await manifestValidator.validateAppMetadata()
        } catch (e) {
          return done.fail(e.toString())
        }
        done()
      })
    })
  })

  describe('validateAppManifest', () => {
    describe('without security exclusions', () => {
      it('passes for a valid app manifest', async (done) => {
        try {
          await manifestValidator.validateAppManifest(chainManifest.chainId)
        } catch (e) {
          return done.fail(e.toString())
        }
        done()
      })

      it('passes for matching domains even with trailing slash in domain listed in chain manifest', async (done) => {
        chainManifest.manifest.domain = 'http://domain.one/'

        try {
          await manifestValidator.validateAppManifest(chainManifest.chainId)
        } catch (e) {
          return done.fail(e.toString())
        }
        done()
      })

      it('fails when chain manifest domain field doesn\'t match protocol', async (done) => {
        chainManifest.manifest.domain = 'https://domain.one'

        try {
          await manifestValidator.validateAppManifest(chainManifest.chainId)
        } catch (e) {
          expect(e.message).toBe(ERROR_MESSAGES.INVALID_DOMAIN_MATCH)
          return done()
        }
        done.fail('validateAppManifest did not fail on a mismatched domain protocol')
      })

      it('fails when chain manifest domain field is subdomain of request domain', async (done) => {
        chainManifest.manifest.domain = 'http://sub.domain.one'

        try {
          await manifestValidator.validateAppManifest(chainManifest.chainId)
        } catch (e) {
          expect(e.message).toBe(ERROR_MESSAGES.INVALID_DOMAIN_MATCH)
          return done()
        }
        done.fail('validateAppManifest did not fail for sub domain of request domain')
      })

      it('fails when chain manifest domain field doesn\'t match request domain', async (done) => {
        chainManifest.manifest.domain = 'WRONG DOMAIN'

        try {
          await manifestValidator.validateAppManifest(chainManifest.chainId)
        } catch (e) {
          expect(e.message).toBe('Invalid URL')
          return done()
        }
        done.fail('validateAppManifest did not fail for mismatched request domain')
      })

      it('fails for an invalid chain manifest with a missing required field', async (done) => {
        delete chainManifest.manifest.account

        try {
          await manifestValidator.validateAppManifest(chainManifest.chainId)
        } catch (e) {
          expect(e.message).toBe(ERROR_MESSAGES.INVALID_CHAIN_MANIFEST_SCHEMA)
          return done()
        }
        done.fail('validateAppManifest did not fail for missing required field')
      })

      it('fails for an invalid app manifest with a missing required field', async (done) => {
        delete appManifest.spec_version

        try {
          await manifestValidator.validateAppManifest(chainManifest.chainId)
        } catch (e) {
          expect(e.message).toBe(ERROR_MESSAGES.INVALID_CHAIN_MANIFEST_SCHEMA)
          return done()
        }
        done.fail('validateAppManifest did not fail for missing required field')
      })

      it('fails for an invalid app manifest with a missing manifests field', async (done) => {
        delete appManifest.manifests

        try {
          await manifestValidator.validateAppManifest(chainManifest.chainId)
        } catch (e) {
          expect(e.message).toBe(ERROR_MESSAGES.INVALID_CHAIN_MANIFEST_SCHEMA)
          return done()
        }
        done.fail('validateAppManifest did not fail for missing manifests field')
      })

      it('fails for an invalid chain manifest with an appmeta that has a missing hash', async (done) => {
        chainManifest.manifest.appmeta = 'http://domain.one/app-metadata.json'

        try {
          await manifestValidator.validateAppManifest(chainManifest.chainId)
        } catch (e) {
          expect(e.message).toBe(ERROR_MESSAGES.MISSING_FILE_HASH('appmeta'))
          return done()
        }
        done.fail('validateAppManifest did not fail for missing hash on appmeta')
      })

      it('fails for an invalid chain manifest with an appmeta that has a wrong hash', async (done) => {
        chainManifest.manifest.appmeta = 'http://domain.one/app-metadata.json#WRONG_HASH'

        try {
          await manifestValidator.validateAppManifest(chainManifest.chainId)
        } catch (e) {
          expect(e.message).toBe(ERROR_MESSAGES.MISMATCHED_FILE_HASH('appmeta'))
          return done()
        }
        done.fail('validateAppManifest did not fail for wrong hash on appmeta')
      })
    })

    describe('with security exclusions', () => {
      it('passes for invalid app manifest when appMetadataIntegrity exclusion is active', async (done) => {
        jest.spyOn(SecurityExclusionHelpers, 'shouldValidate').mockImplementation((exclusion: string) => {
          return exclusion !== 'appMetadataIntegrity'
        })

        delete chainManifest.manifest.account

        try {
          await manifestValidator.validateAppManifest(chainManifest.chainId)
        } catch (e) {
          return done.fail(e.toString())
        }
        done()
      })

      it('passes for invalid appmeta hash when appMetadataIntegrity exclusion is active', async (done) => {
        jest.spyOn(SecurityExclusionHelpers, 'shouldValidate').mockImplementation((exclusion: string) => {
          return exclusion !== 'appMetadataIntegrity'
        })

        chainManifest.manifest.appmeta = 'http://domain.one/app-metadata.json#WRONG_HASH'

        try {
          await manifestValidator.validateAppManifest(chainManifest.chainId)
        } catch (e) {
          return done.fail(e.toString())
        }
        done()
      })

      it('passes for non-matching chain manifest domain when domainMatch exclusion is active', async (done) => {
        jest.spyOn(SecurityExclusionHelpers, 'shouldValidate').mockImplementation((exclusion: string) => {
          return exclusion !== 'domainMatch'
        })

        chainManifest.manifest.domain = 'WRONG DOMAIN'

        try {
          await manifestValidator.validateAppManifest(chainManifest.chainId)
        } catch (e) {
          return done.fail(e.toString())
        }
        done()
      })
    })
  })

  describe('validateTransaction', () => {
    describe('without security exclusions', () => {
      it('passes for a transaction with multiple valid actions listed in the whitelist', async (done) => {
        try {
          await manifestValidator.validateTransaction(transactionInfo, chainManifest.chainId)
        } catch (e) {
          return done.fail(e.toString())
        }
        done()
      })

      it('passes for a transaction when whitelist has action wildcard', async (done) => {
        chainManifest.manifest.whitelist[0].action = ''

        try {
          await manifestValidator.validateTransaction(transactionInfo, chainManifest.chainId)
        } catch (e) {
          return done.fail(e.toString())
        }
        done()
      })

      it('passes for a transaction when whitelist has contract wildcard', async (done) => {
        chainManifest.manifest.whitelist[0].contract = ''

        try {
          await manifestValidator.validateTransaction(transactionInfo, chainManifest.chainId)
        } catch (e) {
          return done.fail(e.toString())
        }
        done()
      })

      it('passes for a transaction when whitelist has action and contract wildcard', async (done) => {
        chainManifest.manifest.whitelist[0].action = ''
        chainManifest.manifest.whitelist[0].contract = ''

        try {
          await manifestValidator.validateTransaction(transactionInfo, chainManifest.chainId)
        } catch (e) {
          return done.fail(e.toString())
        }
        done()
      })

      it('fails for a transaction with an invalid action not in the whitelist', async (done) => {
        transactionInfo.actions.push({
          account: 'invalid account',
          name: 'invalid action',
          authorization: [
            {
              actor: 'actor1',
              permission: 'active',
            },
          ],
          data: {
            from: 'actor1',
            to: 'actor2',
            quantity: '10000.0000 EOS',
            memo: 'Memo',
          },
        })

        try {
          await manifestValidator.validateTransaction(transactionInfo, chainManifest.chainId)
        } catch (e) {
          expect(e.message).toBe(ERROR_MESSAGES.INVALID_ACTIONS('invalid account::invalid action'))
          return done()
        }
        done.fail('validateTransaction did not fail on transaction with non-whitelisted actions')
      })

      it('returns false for a transaction with multiple invalid actions not in the whitelist', async (done) => {
        transactionInfo.actions.push({
          account: 'invalid account 1',
          name: 'invalid action 1',
          authorization: [
            {
              actor: 'actor1',
              permission: 'active',
            },
          ],
          data: {
            from: 'actor1',
            to: 'actor2',
            quantity: '10000.0000 EOS',
            memo: 'Memo',
          },
        }, {
          account: 'invalid account 2',
          name: 'invalid action 2',
          authorization: [
            {
              actor: 'actor1',
              permission: 'active',
            },
          ],
          data: {
            from: 'actor1',
            to: 'actor2',
            quantity: '10000.0000 EOS',
            memo: 'Memo',
          },
        })

        try {
          await manifestValidator.validateTransaction(transactionInfo, chainManifest.chainId)
        } catch (e) {
          const actions = 'invalid account 1::invalid action 1, invalid account 2::invalid action 2'
          expect(e.message).toBe(ERROR_MESSAGES.INVALID_ACTIONS(actions))
          return done()
        }
        done.fail('validateTransaction did not fail on multiple transactions with non-whitelisted actions')
      })
    })

    describe('with security exclusions', () => {
      it('passes for actions not in the whitelist when whitelistedActions exclusion is active ', async (done) => {
        jest.spyOn(SecurityExclusionHelpers, 'shouldValidate').mockImplementation((exclusion: string) => {
          return exclusion !== 'whitelistedActions'
        })

        transactionInfo.actions.push({
          account: 'invalid account',
          name: 'invalid action',
          authorization: [
            {
              actor: 'actor1',
              permission: 'active',
            },
          ],
          data: {
            from: 'actor1',
            to: 'actor2',
            quantity: '10000.0000 EOS',
            memo: 'Memo',
          },
        })

        try {
          await manifestValidator.validateTransaction(transactionInfo, chainManifest.chainId)
        } catch (e) {
          return done.fail(e.toString())
        }
        done()
      })
    })
  })

  describe('transactionWithAssertAction', () => {
    let requestEnvelope: any

    beforeEach(() => {
      requestEnvelope = {}
      assertActionCreatorMocks.transactionWithAssertAction.mockReturnValue('transactionWithAssertAction')
    })

    describe('without security exclusions', () => {
      it('adds the assert action', async () => {
        const result = await manifestValidator.transactionWithAssertAction(
          transactionInfo,
          chainManifest.chainId,
          requestEnvelope,
          )

        expect(assertActionCreatorMocks.transactionWithAssertAction).toHaveBeenCalledWith({
          dappInfo,
          transactionBundle: {
            transactionInfo,
            requestEnvelope,
          },
        })
        expect(result).toEqual('transactionWithAssertAction')
      })
    })

    describe('with security exclusions', () => {
      it('does not add the assert action', async () => {
        jest.spyOn(SecurityExclusionHelpers, 'shouldValidate').mockImplementation((exclusion: string) => {
          return exclusion !== 'addAssertToTransactions'
        })

        const result = await manifestValidator.transactionWithAssertAction(
          transactionInfo,
          chainManifest.chainId,
          requestEnvelope,
          )

        expect(result).toEqual({
          transactionInfo,
          requestEnvelope,
        })
      })
    })
  })
})
