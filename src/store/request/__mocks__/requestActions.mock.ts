import 'utils/storage/__mocks__/RequestStorage.mock'
import * as fetchActions from 'store/request/requestActions'

export const requestFetch = jest.fn()
jest.spyOn(fetchActions, 'requestFetch').mockImplementation(requestFetch)
