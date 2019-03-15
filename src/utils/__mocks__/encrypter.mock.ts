import 'workers/__mocks__/EncryptWorker.mock'
import 'workers/__mocks__/DecryptWorker.mock'
import 'workers/__mocks__/ReEncryptWorker.mock'

import * as encrypter from 'utils/encrypter'

export const encrypt = jest.spyOn(encrypter, 'encrypt')
export const decrypt = jest.spyOn(encrypter, 'decrypt')
export const reEncryptAuths = jest.spyOn(encrypter, 'reEncryptAuths')
