import * as loadActions from 'store/global/globalActions'

export const globalLoad = jest.fn()
jest.spyOn(loadActions, 'globalLoad').mockImplementation(globalLoad)
