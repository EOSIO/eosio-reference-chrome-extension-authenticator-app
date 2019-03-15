import '__mocks__/chrome.mock'
import * as ActionHandler from 'background/ActionHandler'

export const handleAction = jest.fn()

export const ActionHandlerMock = {
  handleAction,
}

jest.spyOn(ActionHandler, 'default').mockImplementation(() => ActionHandlerMock)
