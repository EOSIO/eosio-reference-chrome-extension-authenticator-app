import chrome from '__mocks__/chrome.mock'

declare var global: any

global.chrome = chrome
global.URL = jest.fn()

export default global
