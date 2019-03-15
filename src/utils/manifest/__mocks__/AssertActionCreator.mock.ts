import * as AssertActionCreator from 'utils/manifest/AssertActionCreator'

export const transactionWithAssertAction = jest.fn()

jest.spyOn(AssertActionCreator, 'default').mockImplementation(() => ({
  transactionWithAssertAction,
}))
