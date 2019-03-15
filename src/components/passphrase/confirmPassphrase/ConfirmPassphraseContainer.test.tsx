import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import * as hashjs from 'hash.js'

import { ConfirmPassphraseContainer } from 'components/passphrase/confirmPassphrase/ConfirmPassphraseContainer'
import ConfirmPassphraseView from 'components/passphrase/confirmPassphrase/ConfirmPassphraseView'

describe('ConfirmPassphraseView', () => {
  let confirmPassphraseContainer: ShallowWrapper
  let onConfirmPassphrase: jest.Mock
  let onFailPassphrase: jest.Mock

  beforeEach(() => {
    onConfirmPassphrase = jest.fn()
    onFailPassphrase = jest.fn()
    confirmPassphraseContainer = shallow(
      <ConfirmPassphraseContainer
        passphraseHash='hash'
        onConfirmPassphrase={onConfirmPassphrase}
        onFailPassphrase={onFailPassphrase}
      />,
    )
  })

  describe('when the passphrase hash matches', () => {
    beforeEach(() => {
      jest.spyOn(hashjs, 'sha256').mockReturnValue({
        update: jest.fn().mockReturnValue({
          digest: jest.fn().mockReturnValue('hash'),
        }),
      })
    })

    it('should invoke the onConfirmPassphrase callback', () => {
      confirmPassphraseContainer.find(ConfirmPassphraseView).prop('onConfirmPassphrase')('passphrase')
      expect(onConfirmPassphrase).toHaveBeenCalledWith('passphrase')
    })
  })

  describe('when the passphrase hash does not match', () => {
    beforeEach(() => {
      jest.spyOn(hashjs, 'sha256').mockReturnValue({
        update: jest.fn().mockReturnValue({
          digest: jest.fn().mockReturnValue('wronghash'),
        }),
      })

      confirmPassphraseContainer.find(ConfirmPassphraseView).prop('onConfirmPassphrase')('passphrase')
    })

    it('should increment the number of attempts', () => {
      expect(confirmPassphraseContainer.state('attempts')).toBe(2)
    })

    it('should set an error message', () => {
      expect(confirmPassphraseContainer.state('error')).toBe('Invalid Passphrase')
    })

    it('should invoke onFailPassphrase when attempts is equal to 3', () => {
      confirmPassphraseContainer.find(ConfirmPassphraseView).prop('onConfirmPassphrase')('passphrase')
      confirmPassphraseContainer.find(ConfirmPassphraseView).prop('onConfirmPassphrase')('passphrase')
      expect(onFailPassphrase).toHaveBeenCalled()
    })
  })
})
