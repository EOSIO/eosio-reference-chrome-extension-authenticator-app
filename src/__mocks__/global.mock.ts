import * as chrome from '__mocks__/chrome.mock'
import { TextEncoder, TextDecoder } from 'text-encoding'

declare var global: any

global.chrome = chrome
global.URL = jest.fn()
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

module.exports = global
