import * as WindowMessengerMock from 'content/__mocks__/WindowMessenger.mock'

describe('Content', () => {
  beforeEach(() => {
    require('./content')
  })

  it('should set up WindowMessage listeners', () => {
    expect(WindowMessengerMock.setUpMessageListeners).toHaveBeenCalled()
  })
})
