import * as helpers from 'utils/helpers'

describe('helpers', () => {
  describe('convertToLegacyPubKey', () => {
    it('converts K1 public key to legacy public key', () => {
      const result = helpers.convertToLegacyPubKey('PUB_K1_5j67P1W2RyBXAL8sNzYcDLox3yLpxyrxgkYy1xsXzVCw1oi9eG')
      expect(result).toBe('EOS5j67P1W2RyBXAL8sNzYcDLox3yLpxyrxgkYy1xsXzVCvzbYpba')
    })

    it('does not convert public key if it is not K1 type', () => {
      const result = helpers.convertToLegacyPubKey('NOT_K1_PRIVATE_KEY')
      expect(result).toBe('NOT_K1_PRIVATE_KEY')
    })
  })
})
