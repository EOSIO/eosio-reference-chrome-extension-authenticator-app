import 'utils/storage/__mocks__/DappInfoStorage.mock'
import * as fetchActions from 'store/dappInfo/dappInfoActions'

export const dappInfoFetch = jest.fn()
jest.spyOn(fetchActions, 'dappInfoFetch').mockImplementation(dappInfoFetch)
