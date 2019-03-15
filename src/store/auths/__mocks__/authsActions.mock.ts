import 'utils/storage/__mocks__/AuthStorage.mock'
import 'utils/__mocks__/encrypter.mock'

import * as actions from 'store/auths/authsActions'

export const authsFetch = jest.fn()
jest.spyOn(actions, 'authsFetch').mockImplementation(authsFetch)

export const authAdd = jest.fn()
jest.spyOn(actions, 'authAdd').mockImplementation(authAdd)

export const authRemove = jest.fn()
jest.spyOn(actions, 'authRemove').mockImplementation(authRemove)
