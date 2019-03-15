import '__mocks__/chrome.mock'
import 'utils/__mocks__/encrypter.mock'

import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'

import {
  CreatePassphraseContainer,
  mapDispatchToProps,
} from 'components/passphrase/createPassphrase/CreatePassphraseContainer'
import CreatePassphraseForm from 'components/passphrase/createPassphrase/CreatePassphraseForm'
import RoutePath from 'constants/routePath'
import * as passphraseActions from 'store/passphrase/passphraseActions'

describe('CreatePassphraseContainer', () => {
  let passphraseContainer: ShallowWrapper
  let history: any
  let dispatch: jest.Mock
  let onPassphraseAdd: jest.Mock
  const event = {
    passphrase: 'passphrase',
    confirmPassphrase: 'passphrase',
  }

  beforeEach(() => {
    history = {
      push: jest.fn(),
      replace: jest.fn(),
    }
    onPassphraseAdd = jest.fn()
    dispatch = jest.fn()

    passphraseContainer = shallow(
      <CreatePassphraseContainer
        history={history}
        onPassphraseAdd={onPassphraseAdd}
        location={null}
        match={null}
      />,
    )
  })

  it('maps onPassphraseAdd prop to passphraseAdd action', () => {
    const { onPassphraseAdd: dispatchPassphraseAdd } = mapDispatchToProps(dispatch)

    jest.spyOn(passphraseActions, 'passphraseAdd').mockReturnValue('adding passphrase')

    dispatchPassphraseAdd('phrase')
    expect(dispatch).toHaveBeenCalledWith('adding passphrase')
  })

  describe('when the user adds a passphrase', () => {
    beforeEach(() => {
      passphraseContainer.find(CreatePassphraseForm).prop('onCreatePassphrase')('phrase')
    })

    it('calls the passphrase add callback', () => {
      expect(onPassphraseAdd).toHaveBeenCalledWith('phrase')
    })

    it('navigates to the auths page', () => {
      expect(history.replace).toHaveBeenCalledWith(RoutePath.AUTHS)
    })
  })

  describe('when the user changes input values within the form', () => {
    it('changes passphrase state accordingly', () => {
      passphraseContainer.find(
        CreatePassphraseForm,
      ).prop('onFormInputChange')(event)
      expect(passphraseContainer.state('passphrase')).toEqual('passphrase')
    })

    it('changes the confirmed passphrase state accordingly', () => {
      passphraseContainer.find(
        CreatePassphraseForm,
      ).prop('onFormInputChange')(event)
    })
  })
})
