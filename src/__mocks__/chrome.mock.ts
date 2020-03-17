import * as chrome from 'sinon-chrome'

declare var global: any

global.chrome = chrome

module.exports = chrome
