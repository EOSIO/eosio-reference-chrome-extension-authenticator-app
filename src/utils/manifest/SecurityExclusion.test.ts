import * as payloadData from '__mocks__/data.mock'
import * as manifestData from 'utils/manifest/__mocks__/manifestData.mock'

import * as SecurityExclusionHelpers from './SecurityExclusion'

describe('SecurityExclusion', () => {
  describe('shouldValidate', () => {
    const payload = {
      securityExclusions: payloadData.securityExclusions,
    }

    it('returns false when insecure mode is enabled and domain is whitelisted', () => {
      payload.securityExclusions.addAssertToTransactions = true

      const result = SecurityExclusionHelpers.shouldValidate(
        'addAssertToTransactions',
        payload.securityExclusions,
        { enabled: true, whitelist: [manifestData.dappInfo.rootUrl] },
        manifestData.dappInfo.rootUrl,
      )
      expect(result).toEqual(false)
    })

    it('returns true when insecure mode is disabled', () => {
      const result = SecurityExclusionHelpers.shouldValidate(
        'addAssertToTransactions',
        payload.securityExclusions,
        { enabled: false, whitelist: [manifestData.dappInfo.rootUrl] },
        manifestData.dappInfo.rootUrl,
      )
      expect(result).toEqual(true)
    })

    it('returns true when domain is not whitelisted', () => {
      const result = SecurityExclusionHelpers.shouldValidate(
        'addAssertToTransactions',
        payload.securityExclusions,
        { enabled: true, whitelist: [] },
        manifestData.dappInfo.rootUrl,
      )
      expect(result).toEqual(true)
    })

    it('returns true when whitelist is undefined', () => {
      const result = SecurityExclusionHelpers.shouldValidate(
        'addAssertToTransactions',
        payload.securityExclusions,
        { enabled: true, whitelist: undefined },
        manifestData.dappInfo.rootUrl,
      )
      expect(result).toEqual(true)
    })

    it('returns true when security exclusions are undefined', () => {
      const result = SecurityExclusionHelpers.shouldValidate(
        'addAssertToTransactions',
        undefined,
        { enabled: true, whitelist: [manifestData.dappInfo.rootUrl] },
        manifestData.dappInfo.rootUrl,
      )
      expect(result).toEqual(true)
    })

    it('returns true when security exclusions are null', () => {
      const result = SecurityExclusionHelpers.shouldValidate(
        'addAssertToTransactions',
        null,
        { enabled: true, whitelist: [manifestData.dappInfo.rootUrl] },
        manifestData.dappInfo.rootUrl,
      )
      expect(result).toEqual(true)
    })

    it('returns true when security exclusions are empty', () => {
      const result = SecurityExclusionHelpers.shouldValidate(
        'addAssertToTransactions',
        {},
        { enabled: true, whitelist: [manifestData.dappInfo.rootUrl] },
        manifestData.dappInfo.rootUrl,
      )
      expect(result).toEqual(true)
    })
  })
})
