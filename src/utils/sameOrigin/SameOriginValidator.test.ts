import '__mocks__/chrome.mock'
import * as payloadData from '__mocks__/data.mock'
import * as manifestData from 'utils/manifest/__mocks__/manifestData.mock'
import * as manifestProviderMocks from 'utils/manifest/__mocks__/ManifestProvider.mock'
import * as insecureModeStorageMocks from 'utils/storage/__mocks__/InsecureModeStorage.mock'

import {
  SignatureProviderRequestEnvelope,
  AppManifest,
  SecurityExclusions,
} from 'eosjs-signature-provider-interface'

import SameOriginValidator from 'utils/sameOrigin/SameOriginValidator'
import * as SecurityExclusionHelpers from 'utils/manifest/SecurityExclusion'
import { ERROR_MESSAGES } from 'utils/sameOrigin/SameOriginValidator'
import { clone } from 'utils/helpers'

describe('SameOriginValidator', () => {
  let sameOriginValidator: SameOriginValidator
  let manifestProvider: any
  let requestEnvelope: SignatureProviderRequestEnvelope
  let securityExclusions: SecurityExclusions
  let appManifest: AppManifest
  let senderUrl: string

  beforeEach(() => {
    requestEnvelope = {
      version: 'version',
      id: 'requestId',
      declaredDomain: 'http://domain.one',
      returnUrl: 'http://domain.one/return',
      callbackUrl: 'http://domain.one/callback',
      request: {},
    }

    appManifest = clone(manifestData.appManifest)
    securityExclusions = clone(payloadData.securityExclusions)
    manifestProvider = manifestProviderMocks.manifestProviderMock

    insecureModeStorageMocks.get.mockResolvedValue({})
    manifestProvider.getAppManifest.mockResolvedValue(appManifest)
    manifestProvider.rootUrl = 'http://domain.one'

    senderUrl = 'http://domain.one'

    jest.spyOn(SecurityExclusionHelpers, 'shouldValidate').mockReturnValue(true)

    sameOriginValidator = new SameOriginValidator({ manifestProvider, securityExclusions })
  })

  it('should pass on a valid same origin policy check', async (done) => {
    try {
      await sameOriginValidator.validateSameOriginPolicy(requestEnvelope, senderUrl)
    } catch (e) {
      return done.fail(e)
    }

    done()
  })

  it('should pass even if manifest domain has a trailing slash', async (done) => {
    appManifest.manifests[0].manifest.domain = 'http://domain.one/'

    try {
      await sameOriginValidator.validateSameOriginPolicy(requestEnvelope, senderUrl)
    } catch (e) {
      return done.fail(e)
    }

    done()
  })

  describe('url paths', () => {
    describe('without security exclusions', () => {
      it('should fail if there is no declaredDomain', async (done) => {
        requestEnvelope.declaredDomain = ''

        try {
          await sameOriginValidator.validateSameOriginPolicy(requestEnvelope, senderUrl)
        } catch (e) {
          expect(e.message).toBe(ERROR_MESSAGES.NO_DECLARED_DOMAIN)
          return done()
        }

        done.fail('validateSameOriginPolicy should fail when there is no declaredDomain')
      })

      it('should fail if declaredDomain is not the same domain as senderUrl', async (done) => {
        requestEnvelope.declaredDomain = 'http://domain.two'

        try {
          await sameOriginValidator.validateSameOriginPolicy(requestEnvelope, senderUrl)
        } catch (e) {
          expect(e.message).toBe(ERROR_MESSAGES.INVALID_DECLARED_DOMAIN('http://domain.one', 'http://domain.two'))
          return done()
        }

        done.fail('validateSameOriginPolicy should fail when declaredDomain is not the same domain as senderUrl')
      })

      it('should fail if declaredDomain is a sub domain of senderUrl', async (done) => {
        requestEnvelope.declaredDomain = 'http://sub.domain.one'

        try {
          await sameOriginValidator.validateSameOriginPolicy(requestEnvelope, senderUrl)
        } catch (e) {
          expect(e.message).toBe(ERROR_MESSAGES.INVALID_DECLARED_DOMAIN('http://domain.one', 'http://sub.domain.one'))
          return done()
        }

        done.fail('validateSameOriginPolicy should fail when declaredDomain is a sub domain of senderUrl')
      })

      it('should fail if callbackUrl is not the same domain as declaredDomain', async (done) => {
        requestEnvelope.callbackUrl = 'http://domain.two'

        try {
          await sameOriginValidator.validateSameOriginPolicy(requestEnvelope, senderUrl)
        } catch (e) {
          expect(e.message).toBe(ERROR_MESSAGES.INVALID_CALLBACK_URL('http://domain.two', 'http://domain.one'))
          return done()
        }

        done.fail('validateSameOriginPolicy should fail when callbackUrl is not the same domain as declaredDomain')
      })

      it('should fail if callbackUrl is a sub domain of declaredDomain', async (done) => {
        requestEnvelope.callbackUrl = 'http://sub.domain.one'

        try {
          await sameOriginValidator.validateSameOriginPolicy(requestEnvelope, senderUrl)
        } catch (e) {
          expect(e.message).toBe(ERROR_MESSAGES.INVALID_CALLBACK_URL('http://sub.domain.one', 'http://domain.one'))
          return done()
        }

        done.fail('validateSameOriginPolicy should fail when callbackUrl is a sub domain of declaredDomain')
      })

      it('should fail if returnUrl is not the same domain as declaredDomain', async (done) => {
        requestEnvelope.returnUrl = 'http://domain.two'

        try {
          await sameOriginValidator.validateSameOriginPolicy(requestEnvelope, senderUrl)
        } catch (e) {
          expect(e.message).toBe(ERROR_MESSAGES.INVALID_RETURN_URL('http://domain.two', 'http://domain.one'))
          return done()
        }

        done.fail('validateSameOriginPolicy should fail when returnUrl is not the same domain as declaredDomain')
      })

      it('should fail if returnUrl is a sub domain of declaredDomain', async (done) => {
        requestEnvelope.returnUrl = 'http://sub.domain.one'

        try {
          await sameOriginValidator.validateSameOriginPolicy(requestEnvelope, senderUrl)
        } catch (e) {
          expect(e.message).toBe(ERROR_MESSAGES.INVALID_RETURN_URL('http://sub.domain.one', 'http://domain.one'))
          return done()
        }

        done.fail('validateSameOriginPolicy should fail when returnUrl is a sub domain of declaredDomain')
      })
    })

    describe('with security exclusions', () => {
      beforeEach(() => {
        jest.spyOn(SecurityExclusionHelpers, 'shouldValidate').mockImplementation((exclusion: string) => {
          return exclusion !== 'domainMatch'
        })
      })

      it('should pass if there is no declaredDomain if domainMatch exclusion is active', async (done) => {
        requestEnvelope.declaredDomain = ''

        try {
          await sameOriginValidator.validateSameOriginPolicy(requestEnvelope, senderUrl)
        } catch (e) {
          return done.fail(e)
        }

        done()
      })

      // tslint:disable-next-line:max-line-length
      it('should pass if callbackUrl is not the same domain as declaredDomain if domainMatch exclusion is active', async (done) => {
        requestEnvelope.callbackUrl = 'http://domain.two'

        try {
          await sameOriginValidator.validateSameOriginPolicy(requestEnvelope, senderUrl)
        } catch (e) {
          return done.fail(e)
        }

        done()
      })

      // tslint:disable-next-line:max-line-length
      it('should pass if callbackUrl is a sub domain of declaredDomain if domainMatch exclusion is active', async (done) => {
        requestEnvelope.callbackUrl = 'http://sub.domain.one'

        try {
          await sameOriginValidator.validateSameOriginPolicy(requestEnvelope, senderUrl)
        } catch (e) {
          return done.fail(e)
        }

        done()
      })

      // tslint:disable-next-line:max-line-length
      it('should pass if returnUrl is not the same domain as declaredDomain if domainMatch exclusion is active', async (done) => {
        requestEnvelope.returnUrl = 'http://domain.two'

        try {
          await sameOriginValidator.validateSameOriginPolicy(requestEnvelope, senderUrl)
        } catch (e) {
          return done.fail(e)
        }

        done()
      })

      // tslint:disable-next-line:max-line-length
      it('should pass if returnUrl is a sub domain of declaredDomain if domainMatch exclusion is active', async (done) => {
        requestEnvelope.returnUrl = 'http://sub.domain.one'

        try {
          await sameOriginValidator.validateSameOriginPolicy(requestEnvelope, senderUrl)
        } catch (e) {
          return done.fail(e)
        }

        done()
      })
    })
  })

  describe('manifest domains', () => {
    describe('without security exclusions', () => {
      it('should fail if manifest domains do not match declared domain', async (done) => {
        appManifest.manifests[0].manifest.domain = 'http://domain.two'

        try {
          await sameOriginValidator.validateSameOriginPolicy(requestEnvelope, senderUrl)
        } catch (e) {
          expect(e.message).toBe(ERROR_MESSAGES.MISMATCHED_APP_MANIFEST_DOMAINS)
          return done()
        }

        done.fail('validateSameOriginPolicy should fail when domains do not match declared domain')
      })
    })

    describe('with security exclusions', () => {
      beforeEach(() => {
        jest.spyOn(SecurityExclusionHelpers, 'shouldValidate').mockImplementation((exclusion: string) => {
          return exclusion !== 'domainMatch'
        })
      })

      // tslint:disable-next-line:max-line-length
      it('should pass if manifest domains do not match declared domain if domainMatch exclusion is active', async (done) => {
        appManifest.manifests[0].manifest.domain = 'http://domain.two'

        try {
          await sameOriginValidator.validateSameOriginPolicy(requestEnvelope, senderUrl)
        } catch (e) {
          return done.fail(e)
        }

        done()
      })
    })
  })

  describe('app metadata hashes', () => {
    describe('without security exclusions', () => {
      it('should pass if just appmeta urls do not match one another', async (done) => {
        appManifest.manifests[1].manifest.appmeta = 'http://domain.two/app-metadata.json#SHA256Hash'

        try {
          await sameOriginValidator.validateSameOriginPolicy(requestEnvelope, senderUrl)
        } catch (e) {
          return done.fail(e)
        }

        done()
      })

      it('should fail if appmeta hashes do not match one another', async (done) => {
        appManifest.manifests[1].manifest.appmeta = 'http://domain.one/app-metadata.json#WRONG_HASH'

        try {
          await sameOriginValidator.validateSameOriginPolicy(requestEnvelope, senderUrl)
        } catch (e) {
          expect(e.message).toBe(ERROR_MESSAGES.MISMATCHED_APPMETA_HASHES)
          return done()
        }

        done.fail('validateSameOriginPolicy should fail when appmeta hashes do not match one another')
      })
    })

    describe('with security exclusions', () => {
      beforeEach(() => {
        jest.spyOn(SecurityExclusionHelpers, 'shouldValidate').mockImplementation((exclusion: string) => {
          return exclusion !== 'domainMatch'
        })
      })

      // tslint:disable-next-line:max-line-length
      it('should pass if just appmeta urls do not match one another if domainMatch exclusion is active', async (done) => {
        appManifest.manifests[1].manifest.appmeta = 'http://domain.two/app-metadata.json#SHA256Hash'

        try {
          await sameOriginValidator.validateSameOriginPolicy(requestEnvelope, senderUrl)
        } catch (e) {
          return done.fail(e)
        }

        done()
      })

      it('should pass if appmeta hashes do not match one another if domainMatch exclusion is active', async (done) => {
        appManifest.manifests[1].manifest.appmeta = 'http://domain.one/app-metadata.json#WRONG_HASH'

        try {
          await sameOriginValidator.validateSameOriginPolicy(requestEnvelope, senderUrl)
        } catch (e) {
          return done.fail(e)
        }

        done()
      })
    })
  })
})
