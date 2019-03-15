import '__mocks__/chrome.mock'

import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'

import UpdatePassphraseView from './UpdatePassphraseView'
import UpdatePassphraseForm from 'components/passphrase/updatePassphrase/UpdatePassphraseForm'
import { PassphraseRequirements } from 'utils/passphrase/PassphraseValidator'

describe('UpdatePassphraseView', () => {
  let passphraseView: ShallowWrapper
  let passphraseRequirements: PassphraseRequirements
  let onFormSubmit: jest.Mock
  let onFormInputChange: jest.Mock
  const error = ''

  beforeEach(() => {
    onFormSubmit = jest.fn()
    onFormInputChange = jest.fn()
    passphraseRequirements = {
      isLong: false,
      isUnique: false,
      isMatching: false,
    }
    passphraseView = shallow((
      <UpdatePassphraseView
        currentPassphrase=''
        newPassphrase=''
        confirmPassphrase=''
        onFormInputChange={onFormInputChange}
        onFormSubmit={onFormSubmit}
        resetForm={jest.fn()}
        passphraseRequirements={passphraseRequirements}
        error={error}
      />
    ))
  })

  describe('rendering', () => {
    it('renders Update Passphrase title', () => {
      const titleElement = passphraseView.find('.update-passphrase-title')

      expect(titleElement).toHaveLength(1)
      expect(titleElement.text()).toBe('Update Passphrase')
    })

    describe('the UpdatePassphraseForm', () => {
      let passphraseForm: ShallowWrapper

      beforeEach(() => {
        passphraseForm = passphraseView.find(UpdatePassphraseForm)
      })

      it('gets rendered', () => {
        expect(passphraseForm).toHaveLength(1)
      })

      it('passes the onFormSubmit callback', () => {
        expect(passphraseForm.prop('onFormSubmit')).toBe(onFormSubmit)
      })

      it('passes the onFormInputChange callback', () => {
        expect(passphraseForm.prop('onFormInputChange')).toBe(onFormInputChange)
      })
    })
  })
})
