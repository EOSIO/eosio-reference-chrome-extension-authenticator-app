import AuthorityProvider from 'eos/AuthorityProvider'

describe('AuthorityProvider', () => {
  let authorityProvider: AuthorityProvider
  let result: string[]

  beforeEach(async () => {
    authorityProvider = new AuthorityProvider(['publicKey1', 'publicKey2'])
    result = await authorityProvider.getRequiredKeys(null)
  })

  it('retrieves the pubKeys array from the local storage', () => {
    expect(result).toEqual( ['publicKey1', 'publicKey2'])
  })
})
