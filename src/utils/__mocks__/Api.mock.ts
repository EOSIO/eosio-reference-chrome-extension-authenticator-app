import * as Api from 'utils/Api'

export const signTx = jest.fn()
export const deserialize = jest.fn()
export const decodeAbis = jest.fn()

const ApiMock = jest.spyOn(Api, 'default').mockImplementation(() => ({
  signTx,
  deserialize,
  decodeAbis,
}))

export default ApiMock
