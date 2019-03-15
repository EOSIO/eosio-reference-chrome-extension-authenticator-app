import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'

import ConfirmPassphraseView from 'components/passphrase/confirmPassphrase/ConfirmPassphraseView'
import FormLayout from 'components/shared/layout/FormLayout'
import Button from 'components/shared/button/Button'
import FloatingInput from 'components/shared/input/FloatingInput'

describe('ConfirmPassphraseView', () => {
  let confirmPassphraseView: ShallowWrapper
  let onConfirmPassphrase: jest.Mock
  let error: string

  describe('when rendered', () => {
    onConfirmPassphrase = jest.fn()
    error = ''

    confirmPassphraseView = shallow(
      <ConfirmPassphraseView
        onConfirmPassphrase={onConfirmPassphrase}
        error={error}
      />,
    )

    it('should render a floating passphrase input', () => {
      expect(confirmPassphraseView.find(FloatingInput).prop('toggleablePassword')).toBe(true)
    })

    it('should render a footer button', () => {
      expect(confirmPassphraseView.find(Button).childAt(0).text()).toBe('Continue')
    })

    describe('when there is an error', () => {
      beforeEach(() => {
        error = 'Invalid passphrase'
        confirmPassphraseView = shallow(
          <ConfirmPassphraseView
            onConfirmPassphrase={onConfirmPassphrase}
            error={error}
          />,
        )
      })

      it('should pass the error message to the floating input', () => {
        expect(
          confirmPassphraseView.find(FloatingInput).prop('error'),
        ).toBe('Invalid passphrase')
      })
    })

    describe('when user types in a passphrase', () => {
      it('should update the state with the passphrase', () => {
        const event: any = {
          currentTarget: { value: 'passphrase' },
        }
        confirmPassphraseView.find(FloatingInput).prop('onInput')(event)

        expect(confirmPassphraseView.state()).toEqual({
          passphrase: 'passphrase',
          show: false,
        })
      })
    })

    describe('when user submits the form', () => {
      beforeEach(() => {
        const inputEvent: any = {
          currentTarget: { value: 'passphrase' },
        }
        const submitEvent: any = {
          preventDefault: jest.fn(),
        }

        confirmPassphraseView.find(FloatingInput).prop('onInput')(inputEvent)
        confirmPassphraseView.find(FormLayout).prop('onSubmit')(submitEvent)
      })

      it('should invoke the callback with the passphrase', () => {
        expect(onConfirmPassphrase).toHaveBeenCalledWith('passphrase')
      })
    })
  })
})
