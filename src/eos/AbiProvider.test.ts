import * as eosjs from 'eosjs'

import AbiProvider from 'eos/AbiProvider'

describe('AbiProvider', () => {
  let abiProvider: AbiProvider
  let hexAbisArray: any[]
  let rawAbiObject: eosjs.ApiInterfaces.BinaryAbi

  beforeEach(async () => {
    hexAbisArray = [{ abi: 'hex', accountName: 'name' }, { abi: 'hex2', accountName: 'name2' }]
    abiProvider = new AbiProvider(hexAbisArray)

    jest.spyOn(eosjs.Serialize, 'hexToUint8Array').mockImplementation(() => 'uint8')

    rawAbiObject = await abiProvider.getRawAbi('name')
  })

  it('calls hexToUint8Array with abi field from single hexAbiObject', () => {
    expect(eosjs.Serialize.hexToUint8Array).toHaveBeenCalledWith('hex')
    expect(eosjs.Serialize.hexToUint8Array).not.toHaveBeenCalledWith('hex2')
  })

  it('retrieves the abi and changes it to raw form successfully', () => {
    expect(rawAbiObject).toEqual({ abi: 'uint8', accountName: 'name' })
  })
})
