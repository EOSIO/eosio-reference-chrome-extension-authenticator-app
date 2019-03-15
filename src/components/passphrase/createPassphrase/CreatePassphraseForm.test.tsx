import * as React from 'react'
import { ShallowWrapper, shallow } from 'enzyme'

import CreatePassphraseForm from 'components/passphrase/createPassphrase/CreatePassphraseForm'
import Button from 'components/shared/button/Button'
import FloatingInput from 'components/shared/input/FloatingInput'
import FormLayout from 'components/shared/layout/FormLayout'
import { PassphraseRequirements } from 'utils/passphrase/PassphraseValidator'

describe('CreatePassphraseForm', () => {
  let createPassphraseForm: ShallowWrapper
  let onCreatePassphrase: jest.Mock
  let onFormInputChange: jest.Mock
  let passphraseRequirements: PassphraseRequirements

  const event = {
    currentTarget: {
      value: 'passphrase',
    },
  }
  const submitEvent = {
    preventDefault: jest.fn(),
  }

  beforeEach(() => {
    onCreatePassphrase = jest.fn()
    onFormInputChange = jest.fn()
    passphraseRequirements = {
      isLong: false,
      isUnique: false,
      isMatching: false,
    }

    createPassphraseForm = shallow(
      <CreatePassphraseForm
        passphrase=''
        onFormInputChange={onFormInputChange}
        onCreatePassphrase={onCreatePassphrase}
        passphraseRequirements={passphraseRequirements}
      />,
    )
  })

  describe('when rendered', () => {
    it('should render a create passphrase title', () => {
      expect(createPassphraseForm.find('.create-passphrase-title').text()).toBe('Create a Passphrase')
    })

    it('should render a description', () => {
      expect(createPassphraseForm.find('.create-passphrase-body').text()).toContain(
        'In order to ensure you have the best security for your account, we’ll need you to create a passphrase.',
      )
    })

    it('should render a passphrase floating input', () => {
      expect(createPassphraseForm.find(FloatingInput).at(0).prop('placeholder')).toBe('Passphrase')
    })

    it('should render a confirm passphrase floating input', () => {
      expect(createPassphraseForm.find(FloatingInput).at(1).prop('placeholder')).toBe('Confirm Passphrase')
    })

    it('should render the passphrase length requirement', () => {
      const passphraseRequirement = createPassphraseForm.find('.passphrase-requirement > p').first()
      expect(passphraseRequirement.text()).toBe('Must be at least 4 words long')
    })

    it('should render the passphrase uniqueness requirement', () => {
      const passphraseRequirement = createPassphraseForm.find('.passphrase-requirement > p').at(1)
      expect(passphraseRequirement.text()).toBe('Each word must be unique')
    })

    it('should render the matching passphrase requirement', () => {
      const passphraseRequirement = createPassphraseForm.find('.passphrase-requirement > p').at(2)
      expect(passphraseRequirement.text()).toBe('Passphrases must match')
    })

    describe('when passphrase requirements are not met', () => {
      beforeEach(() => {
        passphraseRequirements = {
          isLong: false,
          isUnique: false,
          isMatching: false,
        }

        createPassphraseForm = shallow(
          <CreatePassphraseForm
            passphrase=''
            onFormInputChange={onFormInputChange}
            onCreatePassphrase={onCreatePassphrase}
            passphraseRequirements={passphraseRequirements}
          />,
        )
      })

      it('should render a disabled Button', () => {
        expect(createPassphraseForm.find(Button).childAt(0).text()).toBe('Create Passphrase')
        expect(createPassphraseForm.find(Button).prop('disabled')).toBe(true)
      })

      it('should not render check mark icons', () => {
        expect(createPassphraseForm.find('img').length).toBe(0)
      })
    })

    describe('when passphrase requirements are met', () => {
      beforeEach(() => {
        passphraseRequirements = {
          isLong: true,
          isUnique: true,
          isMatching: true,
        }

        createPassphraseForm = shallow(
          <CreatePassphraseForm
            passphrase=''
            onFormInputChange={onFormInputChange}
            onCreatePassphrase={onCreatePassphrase}
            passphraseRequirements={passphraseRequirements}
          />,
        )
      })

      it('should render an enabled Button', () => {
        expect(createPassphraseForm.find(Button).childAt(0).text()).toBe('Create Passphrase')
        expect(createPassphraseForm.find(Button).prop('disabled')).toBe(false)
      })

      it('should render the checkmark icons', () => {
        expect(createPassphraseForm.find('img').length).toBe(3)
      })
    })
  })

  describe('when passphrase is entered', () => {
    it('should call the onFormInputChange prop', () => {
      createPassphraseForm.find(FloatingInput).first().prop('onInput')(event as React.ChangeEvent<HTMLInputElement>)
      expect(onFormInputChange).toHaveBeenCalledWith({ passphrase: 'passphrase' })
    })
  })

  describe('when confirm passphrase is entered', () => {
    it('it should call the onFormInputChange prop', () => {
      createPassphraseForm.find(FloatingInput).at(1).prop('onInput')(event as React.ChangeEvent<HTMLInputElement>)
      expect(onFormInputChange).toHaveBeenCalledWith({ confirmPassphrase: 'passphrase' })
    })
  })

  describe('when form is submitted', () => {
    beforeEach(() => {
      passphraseRequirements = {
        isLong: true,
        isUnique: true,
        isMatching: true,
      }
      createPassphraseForm = shallow(
        <CreatePassphraseForm
          passphrase='phrase'
          onFormInputChange={onFormInputChange}
          onCreatePassphrase={onCreatePassphrase}
          passphraseRequirements={passphraseRequirements}
        />,
      )
    })

    it('should invoke the onCreatePassphrase callback with the passphrase', () => {
      createPassphraseForm.find(FormLayout).prop('onSubmit')(submitEvent as any)
      expect(onCreatePassphrase).toHaveBeenCalledWith('phrase')
    })
  })
})
