import { ApiInterfaces } from 'eosjs'

export default class AuthorityProvider implements ApiInterfaces.AuthorityProvider {
  private publicKeys: string[]

  constructor(publicKeys: string[]) {
    this.publicKeys = publicKeys
  }

  public async getRequiredKeys(args: ApiInterfaces.AuthorityProviderArgs): Promise<string[]> {
    return this.publicKeys
  }
}
