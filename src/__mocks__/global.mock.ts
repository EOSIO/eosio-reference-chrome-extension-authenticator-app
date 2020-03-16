import chrome from '__mocks__/chrome.mock'
import { jest } from 'jest'

declare var global: any

global.chrome = chrome
global.URL = jest.fn()

export default global
