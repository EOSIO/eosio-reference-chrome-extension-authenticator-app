import '__mocks__/chrome.mock'
import 'utils/__mocks__/encrypter.mock'

import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { sha256 } from 'hash.js'

import * as passphraseActions from 'store/passphrase/passphraseActions'
import { UpdatePassphraseContainer, mapDispatchToProps } from './UpdatePassphraseContainer'
import UpdatePassphraseView from './UpdatePassphraseView'

declare var global: any
global.alert = jest.fn()

describe('UpdatePassphraseContainer', () => {
  let container: ShallowWrapper
  let onPassphraseUpdate: jest.Mock
  let dispatch: jest.Mock

  const currentPassphrase = 'current passphrase'
  const newPassphrase = 'new passphrase'
  const confirmPassphrase = 'new passphrase'
  const passphraseHash = sha256().update(currentPassphrase).digest('hex')
  let inputChangeEvent: any

  beforeEach(() => {
    onPassphraseUpdate = jest.fn()
    dispatch = jest.fn()

    container = shallow((
      <UpdatePassphraseContainer
        onPassphraseUpdate={onPassphraseUpdate}
        passphraseHash={passphraseHash}
      />
    ))
  })

  it('renders an UpdatePassphraseView', () => {
    expect(container.type()).toEqual(UpdatePassphraseView)
  })

  it('calls the passed-in function from the Container when the current passphrase is correct', () => {
    container.setState({
      currentPassphrase,
      newPassphrase,
    })

    container.find(UpdatePassphraseView).prop(
      'onFormSubmit',
    )()
    expect(onPassphraseUpdate).toHaveBeenCalledTimes(1)
  })

  it('updates currentPassphrase state when onFormInputChange is called', () => {
    inputChangeEvent = {
      currentPassphrase,
    }

    container.find(UpdatePassphraseView).prop(
      'onFormInputChange',
    )(inputChangeEvent)

    expect(container.state('currentPassphrase')).toEqual(currentPassphrase)
  })

  it('updates newPassphrase state when onFormInputChange is called', () => {
    inputChangeEvent = {
      newPassphrase,
    }

    container.find(UpdatePassphraseView).prop(
      'onFormInputChange',
    )(inputChangeEvent)

    expect(container.state('newPassphrase')).toEqual(newPassphrase)
  })

  it('updates confirmPassphrase state when onFormInputChange is called', () => {
    inputChangeEvent = {
      confirmPassphrase,
    }

    container.find(UpdatePassphraseView).prop(
      'onFormInputChange',
    )(inputChangeEvent)

    expect(container.state('confirmPassphrase')).toEqual(confirmPassphrase)
  })

  it('sets error message when current passphrase doesn\'t matched stored passphrase', () => {
    expect(container.state('error')).toEqual('');
    (container.prop('onFormSubmit') as () => void)()
    expect(container.state('error')).toEqual('Invalid Passphrase')
  })

  it('calls onPassphraseUpdate when current passphrase does match stored passphrase', () => {
    container.setState({
      currentPassphrase,
      newPassphrase,
    })

    container.find(UpdatePassphraseView).prop('onFormSubmit')()
    expect(onPassphraseUpdate).toHaveBeenCalledTimes(1)
  })

  it('dispatches a passphraseUpdate action when the onPassphraseUpdate is called', () => {
    const { onPassphraseUpdate: dispatchPassphraseUpdate } = mapDispatchToProps(dispatch)

    jest.spyOn(passphraseActions, 'passphraseUpdate').mockReturnValue('updating passphrase')

    dispatchPassphraseUpdate('currentPassphrase', 'newPassphrase')
    expect(dispatch).toHaveBeenCalledWith('updating passphrase')
  })

  it('clears the form values when resetForm callback is invoked', () => {
    container.find(UpdatePassphraseView).prop('resetForm')()
    expect(container.state()).toEqual({
      currentPassphrase: '',
      newPassphrase: '',
      confirmPassphrase: '',
      error: '',
    })
  })
})
