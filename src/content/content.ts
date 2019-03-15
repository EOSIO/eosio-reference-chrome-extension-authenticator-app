/* global chrome */
import getDefaultWindowMessenger from 'content/WindowMessenger'

class Content {
  public static setUp() {
    const windowMessenger = getDefaultWindowMessenger()
    windowMessenger.setUpMessageListeners()
  }
}

Content.setUp()
