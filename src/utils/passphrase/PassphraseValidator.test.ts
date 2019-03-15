import PassphraseValidator from 'utils/passphrase/PassphraseValidator'

describe('PassphraseValidator', () => {
  let passphraseValidator: PassphraseValidator
  let passphrase: string

  beforeEach(() => {
    passphraseValidator = new PassphraseValidator()
  })

  describe('validatePassphrase', () => {
    it('should return true for all passphrase requirements for a valid passphrase', () => {
      passphrase = 'my passphrase is phrase'
      expect(passphraseValidator.validatePassphrase(passphrase, passphrase)).toEqual({
        isLong: true,
        isUnique: true,
        isMatching: true,
      })
    })

    it('should return a false length requirement if the passphrase is less than 4 words', () => {
      passphrase = 'my passphrase'
      expect(passphraseValidator.validatePassphrase(passphrase, '')).toEqual({
        isLong: false,
        isUnique: true,
        isMatching: false,
      })
    })

    it('should return a false uniqueness requirement if the passphrase contains duplicate words', () => {
      passphrase = 'my passphrase passphrase'
      expect(passphraseValidator.validatePassphrase(passphrase, '')).toEqual({
        isLong: false,
        isUnique: false,
        isMatching: false,
      })
    })

    it('should return a false matching requirement if the passphrases do not match', () => {
      passphrase = 'my passphrase 1 2'
      expect(passphraseValidator.validatePassphrase(passphrase, '')).toEqual({
        isLong: true,
        isUnique: true,
        isMatching: false,
      })
    })
  })

  describe('isLong', () => {
    it('should return false if passphrase has less than 4 words', () => {
      passphrase = 'my passphrase is'
      expect(passphraseValidator.isLong(passphrase)).toBe(false)
    })

    it('should return true if passphrase has 4 or more words', () => {
      passphrase = 'my passphrase is a long phrase'
      expect(passphraseValidator.isLong(passphrase)).toBe(true)
    })

    it('should return false if passphrase is an empty string', () => {
      passphrase = ''
      expect(passphraseValidator.isLong(passphrase)).toBe(false)
    })
  })

  describe('isUnique', () => {
    it('should return true if words are unique', () => {
      passphrase = 'passphrase is one word'
      expect(passphraseValidator.isUnique(passphrase)).toBe(true)
    })

    it('should return false if words are not unique', () => {
      passphrase = 'passphrase is one word word'
      expect(passphraseValidator.isUnique(passphrase)).toBe(false)
    })

    it('should return true for empty string', () => {
      passphrase = ''
      expect(passphraseValidator.isUnique(passphrase)).toBe(true)
    })
  })

  describe('isMatching', () => {
    it('should return true if the passphrases match', () => {
      passphrase = 'passphrase is one word'
      expect(passphraseValidator.isMatching(passphrase, 'passphrase is one word')).toBe(true)
    })

    it('should return false if the passphrases do not match', () => {
      passphrase = 'passphrase is one word'
      expect(passphraseValidator.isMatching(passphrase, 'passphrase is two words')).toBe(false)
    })
  })
})
