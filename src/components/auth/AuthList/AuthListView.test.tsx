import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'

import AuthListView from './AuthListView'
import AuthItemView from './AuthItemView'
import AuthItemRemovedView from './AuthItemRemovedView'
import Auth from 'utils/Auth'
import Button from 'components/shared/button/Button'
import { DelayedRemovable } from 'store/AppState'

describe('AuthListView', () => {
  let authListView: ShallowWrapper
  let auths: Array<DelayedRemovable<Auth>>
  let onAddAuth: jest.Mock
  let onAuthRemoveUndo: jest.Mock

  describe('when auths are present', () => {
    beforeEach(() => {
      auths = [
        { encryptedPrivateKey: 'encryptedPrivateKey1', publicKey: 'publicKey1', nickname: 'mykey1' },
        { encryptedPrivateKey: 'encryptedPrivateKey2', publicKey: 'publicKey2', nickname: 'mykey2' },
        { encryptedPrivateKey: 'encryptedPrivateKey3', publicKey: 'publicKey3', nickname: 'mykey3' },
      ]
      onAddAuth = jest.fn()
      onAuthRemoveUndo = jest.fn()

      authListView = shallow(
        <AuthListView
          loading={false}
          auths={auths}
          onAddAuth={onAddAuth}
          onAuthRemoveUndo={onAuthRemoveUndo}
        />,
      )
    })

    it('should display a list of all 3 keys', () => {
      expect(authListView.find(AuthItemView).length).toBe(3)
    })

    it('should display AuthItems with correct data', () => {
      expect(authListView.find(AuthItemView).at(0).props()).toEqual({
        auth: auths[0],
      })
      expect(authListView.find(AuthItemView).at(1).props()).toEqual({
        auth: auths[1],
      })
      expect(authListView.find(AuthItemView).at(2).props()).toEqual({
        auth: auths[2],
      })
    })
  })

  describe('when an auth is marked for removal', () => {
    beforeEach(() => {
      auths = [
        { encryptedPrivateKey: 'encryptedPrivateKey1', publicKey: 'publicKey1', nickname: 'mykey1', removing: true },
      ]
      onAddAuth = jest.fn()
      onAuthRemoveUndo = jest.fn()

      authListView = shallow(
        <AuthListView
          loading={false}
          auths={auths}
          onAddAuth={onAddAuth}
          onAuthRemoveUndo={onAuthRemoveUndo}
        />,
      )
    })

    it('should display AuthItemRemoved with correct data', () => {
      expect(authListView.find(AuthItemRemovedView).props()).toEqual({
        auth: auths[0],
        onAuthRemoveUndo,
      })
    })
  })

  describe('when auths are not present', () => {
    beforeEach(() => {
      authListView = shallow(
        <AuthListView
          loading={false}
          auths={[]}
          onAddAuth={onAddAuth}
          onAuthRemoveUndo={onAuthRemoveUndo}
        />,
      )
    })

    it('should display an icon indicating that no auths are found', () => {
      expect(authListView.find('img.no-auths-icon').length).toBe(1)
    })

    it('should display no auths help text', () => {
      expect(authListView.find('.no-auths-text').text()).toContain(
        'To get started, add an Auth using the button below.',
      )
    })
  })

  it('should render a footer button with correct text and image', () => {
    expect(authListView.find(Button).find('img')).toBeDefined()
    expect(authListView.find(Button).childAt(1).text()).toBe('Add Additional Auth')
  })

  describe('when add auth button is clicked', () => {
    beforeEach(() => {
      authListView = shallow(
        <AuthListView
          loading={false}
          auths={auths}
          onAddAuth={onAddAuth}
          onAuthRemoveUndo={onAuthRemoveUndo}
        />,
      )
    })

    it('should route the user to the add auth page', () => {
      authListView.find(Button).prop('onClick')()
      expect(onAddAuth).toHaveBeenCalled()
    })
  })
})
