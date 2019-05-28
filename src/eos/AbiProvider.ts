import { ApiInterfaces, Serialize } from 'eosjs'
import { HexAbi } from 'eosjs-signature-provider-interface'

export default class AbiProvider implements ApiInterfaces.AbiProvider {
  private hexAbiInfos: any[]

  constructor(hexAbiInfos: HexAbi[]) {
    this.hexAbiInfos = hexAbiInfos
  }

  public async getRawAbi(accountName: string): Promise<ApiInterfaces.BinaryAbi> {
    const hexAbi = (this.hexAbiInfos.find((hexAbiObject: any) => hexAbiObject.accountName === accountName)).abi
    const abi = Serialize.hexToUint8Array(hexAbi)
    return { accountName, abi }
  }
}
