import * as React from 'react'
import { shallow, ShallowWrapper, HTMLAttributes } from 'enzyme'

import AuthItemRemovedView from './AuthItemRemovedView'
import Auth from 'utils/Auth'

describe('AuthItemRemovedView', () => {
  let authItemView: ShallowWrapper
  let auth: Auth
  let onAuthRemoveUndo: jest.Mock

  beforeEach(() => {
    auth = {
      encryptedPrivateKey: 'encryptedPrivateKey',
      publicKey: 'publicKey',
      nickname: 'myKey1',
    }

    onAuthRemoveUndo = jest.fn()

    authItemView = shallow(
      <AuthItemRemovedView
        auth={auth}
        onAuthRemoveUndo={onAuthRemoveUndo}
      />,
    )
  })

  it('should show the correct text', () => {
    expect(authItemView.find('.auth-removed span').text()).toEqual('myKey1 deleted.')
  })

  it('should show the undo button text', () => {
    expect(authItemView.find('.auth-removed a').text()).toEqual('Undo')
  })

  describe('on undo button click', () => {
    let undoButton: ShallowWrapper<HTMLAttributes, any>

    beforeEach(() => {
      const event: any = {}
      undoButton = authItemView.find('.auth-removed a')

      undoButton.prop('onClick')(event)
    })

    it('should call the AuthRemoveUndo callback', () => {
      expect(onAuthRemoveUndo).toHaveBeenCalledTimes(1)
    })
  })
})
