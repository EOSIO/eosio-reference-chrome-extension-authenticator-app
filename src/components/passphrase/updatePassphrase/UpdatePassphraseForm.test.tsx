import '__mocks__/chrome.mock'

import * as React from 'react'
import { mount, ReactWrapper } from 'enzyme'

import UpdatePassphraseForm from './UpdatePassphraseForm'
import FloatingInput from 'components/shared/input/FloatingInput'
import { PassphraseRequirements } from 'utils/passphrase/PassphraseValidator'
import TransitionButton from 'components/shared/transitionButton/TransitionButton'

jest.useFakeTimers()

describe('UpdatePassphraseForm', () => {
  let form: ReactWrapper
  let onFormInputChange: jest.Mock
  let passphraseRequirements: PassphraseRequirements
  let onFormSubmit: jest.Mock
  let resetForm: jest.Mock

  beforeEach(() => {
    onFormSubmit = jest.fn()
    onFormInputChange = jest.fn()
    resetForm = jest.fn()
    passphraseRequirements = {
      isLong: true,
      isUnique: true,
      isMatching: true,
    }
    const error = ''

    form = mount((
      <UpdatePassphraseForm
        currentPassphrase='currentPassphrase'
        newPassphrase='newPassphrase'
        confirmPassphrase='newPassphrase'
        onFormInputChange={onFormInputChange}
        onFormSubmit={onFormSubmit}
        resetForm={resetForm}
        passphraseRequirements={passphraseRequirements}
        error={error}
      />
    ))
  })

  it('renders a form with passed in values', () => {
    expect(form.find('form')).toBeTruthy()
    expect(form.find(FloatingInput).first().prop('value')).toBe('currentPassphrase')
    expect(form.find(FloatingInput).at(1).prop('value')).toBe('newPassphrase')
    expect(form.find(FloatingInput).at(2).prop('value')).toBe('newPassphrase')
  })

  describe('submitting the form', () => {
    let event: any

    beforeEach(() => {
      event = {
        preventDefault: jest.fn(),
      }
    })

    it('prevents the default submit button behavior', async () => {
      await form.find('form').prop('onSubmit')(event)
      expect(event.preventDefault).toHaveBeenCalled()
    })

    it('calls the onFormSubmit action', async () => {
      await form.find('form').prop('onSubmit')(event)
      jest.runAllTimers()
      expect(onFormSubmit).toHaveBeenCalledWith()
    })

    it('should set loading to true while form is submitting', async () => {
      await form.find('form').prop('onSubmit')(event)
      jest.runAllTimers()
      expect(form.state('loading')).toBe(true)
    })

    it('should set loading to false when form has submitted', async () => {
      form.setProps({
        onFormSubmit: jest.fn().mockImplementation(() => true),
      })
      await form.find('form').prop('onSubmit')(event)

      jest.runAllTimers()
      await Promise.resolve()
      jest.runAllTimers()

      expect(form.state('loading')).toBe(false)
    })

    it('should set loading to false when form has failed to submit', async () => {
      form.setProps({
        onFormSubmit: jest.fn().mockImplementation(() => false),
      })
      await form.find('form').prop('onSubmit')(event)

      jest.runAllTimers()
      await Promise.resolve()
      jest.runAllTimers()

      expect(form.state('loading')).toBe(false)
    })

    it('calls the resetForm callback if passphraseUpdate succeeded', async () => {
      form.setProps({
        onFormSubmit: jest.fn().mockImplementation(() => true),
      })
      await form.find('form').prop('onSubmit')(event)

      jest.runAllTimers()
      await Promise.resolve()
      jest.runAllTimers()

      expect(resetForm).toHaveBeenCalled()
    })

    it('should not allow multiple form submissions', async () => {
      form.setProps({
        onFormSubmit: jest.fn().mockImplementation(() => true),
      })
      await form.find('form').prop('onSubmit')(event)

      jest.runAllTimers()

      await form.find('form').prop('onSubmit')(event)

      await Promise.resolve()
      jest.runAllTimers()

      expect(resetForm).toHaveBeenCalledTimes(1)
    })
  })

  it('has three passphrase inputs', () => {
    expect(form.find(FloatingInput)).toHaveLength(3)
  })

  describe('the currentPassphrase input', () => {
    let currentPassphraseInput: ReactWrapper

    beforeEach(() => {
      currentPassphraseInput = form.find(FloatingInput).at(0)
    })

    it('has a Current Passphrase placeholder', () => {
      expect(currentPassphraseInput.prop('placeholder')).toBe('Current Passphrase')
    })

    it('toggles hiding and showing the passphrase', () => {
      expect(currentPassphraseInput.prop('toggleablePassword')).toBe(true)
    })

    it('invokes the on onFormInputChange callback when the value changes', () => {
      const newValueEvent = {
        currentTarget: {
          value: 'currentPassphrase',
        },
      }

      form.find(FloatingInput).at(0).prop('onInput')(newValueEvent as React.ChangeEvent<HTMLInputElement>)
      expect(onFormInputChange).toHaveBeenCalled()
    })
  })

  describe('the newPassphrase input', () => {
    let newPassphraseInput: ReactWrapper

    beforeEach(() => {
      newPassphraseInput = form.find(FloatingInput).at(1)
    })

    it('has an New Passphrase placeholder', () => {
      expect(newPassphraseInput.prop('placeholder')).toBe('New Passphrase')
    })

    it('toggles hiding and showing the passphrase', () => {
      expect(newPassphraseInput.prop('toggleablePassword')).toBe(true)
    })

    it('invokes the onNewPassphrase callback when the value changes', () => {
      newPassphraseInput = newPassphraseInput.prop('onInput')
      const newValueEvent = {
        currentTarget: {
          value: 'newPassphrase',
        },
      }

      form.find(FloatingInput).at(1).prop('onInput')(newValueEvent as React.FormEvent<HTMLInputElement>)
      expect(onFormInputChange).toHaveBeenCalled()
    })
  })

  describe('the confirmPassphrase input', () => {
    let confirmPassphraseInput: ReactWrapper

    beforeEach(() => {
      confirmPassphraseInput = form.find(FloatingInput).at(2)
    })

    it('has a Confirm Passphrase placeholder', () => {
      expect(confirmPassphraseInput.prop('placeholder')).toBe('Confirm Passphrase')
    })

    it('toggles hiding and showing the passphrase', () => {
      expect(confirmPassphraseInput.prop('toggleablePassword')).toBe(true)
    })

    it('invokes the onConfirmPassphrase callback when the value changes', () => {
      const newValueEvent = {
        currentTarget: {
          value: 'currentPassphrase',
        },
      }

      form.find(FloatingInput).at(2).prop('onInput')(newValueEvent as React.FormEvent<HTMLInputElement>)
      expect(onFormInputChange).toHaveBeenCalled()
    })
  })

  describe('newPassphrase requirement indicators', () => {
    describe('minimum number of words', () => {
      it('always shows the minimum words message text', () => {
        expect(form.find('.passphrase-requirement p').at(0).text()).toEqual('Must be at least 4 words long')
      })

      it('new passphrase gets communicated up so Container can validate it', () => {
        const e = {
          currentTarget: {
            value: 'one two three four five',
          },
        }
        form.find(FloatingInput).at(1).prop('onInput')(e as React.ChangeEvent<HTMLInputElement>)
        expect(onFormInputChange).toHaveBeenCalledTimes(1)
      })

      it('shows no checkmark if less than 4 words', () => {
        form.setProps({
          passphraseRequirements: {
            isLong: false,
            isUnique: false,
            isMatching: false,
          },
        })

        expect(form.find('.passphrase-requirement > img').at(0)).toHaveLength(0)
      })

      it('shows checkmark if has enough words', () => {
        form.setProps({
          passphraseRequirements: {
            isLong: true,
            isUnique: false,
            isMatching: false,
          },
        })
        expect(form.find('.passphrase-requirement').at(0).find('img')).toHaveLength(1)
      })
    })

    describe('uniqueness', () => {
      it('shows the unique words message text always', () => {
        expect(form.find('.passphrase-requirement p').at(1).text()).toEqual('Each word must be unique')
      })

      it('new passphrase gets communicated up so Container can validate it', () => {
        const updatedCurrentPassphrase = 'one two three'
        const e = {
          currentTarget: {
            value: updatedCurrentPassphrase,
          },
        }
        form.find(FloatingInput).at(1).prop('onInput')(e as React.ChangeEvent<HTMLInputElement>)
        expect(onFormInputChange).toHaveBeenCalledTimes(1)
      })

      it('shows no checkmark if words aren\'t unique (default state)', () => {
        form.setProps({
          passphraseRequirements: {
            isLong: true,
            isUnique: false,
            isMatching: false,
          },
        })
        expect(form.find('.passphrase-requirement').at(1).find('img')).toHaveLength(0)
      })

      it('shows checkmark if words are unique', () => {
        form.setProps({
          passphraseRequirements: {
            isLong: true,
            isUnique: true,
          },
        })
        expect(form.find('.passphrase-requirement').at(1).find('img')).toHaveLength(1)
      })
    })

    describe('matching', () => {
      it('shows the passphrases must match message', () => {
        expect(form.find('.passphrase-requirement p').at(2).text()).toEqual('Passphrases must match')
      })

      it('updating confirm passphrase gets communicated up so Container can validate it', () => {
        const confirmedPassphrase = 'one two three'
        const e = {
          currentTarget: {
            value: confirmedPassphrase,
          },
        }
        form.find(FloatingInput).at(2).prop('onInput')(e as React.ChangeEvent<HTMLInputElement>)
        expect(onFormInputChange).toHaveBeenCalledTimes(1)
      })

      it('shows checkmark if new passphrase matches confirmed passphrase', () => {
        form.setProps({
          passphraseRequirements: {
            isLong: true,
            isUnique: true,
            isMatching: true,
          },
        })
        expect(form.find('.passphrase-requirement').at(1).find('img')).toHaveLength(1)
      })
    })
  })

  it('has a submit button', () => {
    expect(form.find(TransitionButton)).toHaveLength(1)
  })

  describe('the submit button', () => {
    let transitionButton: ReactWrapper

    beforeEach(() => {
      transitionButton = form.find(TransitionButton)
    })

    it('has the submit type', () => {
      expect(transitionButton.prop('type')).toBe('submit')
    })

    it('has the Update Passphrase text', () => {
      expect(transitionButton.prop('text')).toBe('Update Passphrase')
    })

    it('has the success text', () => {
      expect(transitionButton.prop('successText')).toBe('Passphrase Updated!')
    })

    it('should be disabled if requirements are not met', () => {
      form.setProps({
        passphraseRequirements: {
          isLong: true,
          isUnique: false,
          isMatching: true,
        },
      })

      expect(form.find(TransitionButton).prop('disabled')).toBe(true)
    })

    it('should be enabled if requirements are not met', () => {
      form.setProps({
        passphraseRequirements: {
          isLong: true,
          isUnique: true,
          isMatching: true,
        },
      })

      expect(form.find(TransitionButton).prop('disabled')).toBe(false)
    })
  })
})
