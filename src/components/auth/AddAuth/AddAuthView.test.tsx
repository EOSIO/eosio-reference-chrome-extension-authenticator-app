import '__mocks__/chrome.mock'

import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'

import AddAuthView from './AddAuthView'
import FloatingInput from 'components/shared/input/FloatingInput'
import Button from 'components/shared/button/Button'
import FormLayout from 'components/shared/layout/FormLayout'

describe('AddAuthView', () => {
  let addAuthView: ShallowWrapper
  let onFormInputChange: jest.Mock
  let onAuthAdd: jest.Mock
  let onAuthCancel: jest.Mock
  const addAuthErrors = {
    privateKey: 'private key error',
    nickname: 'nickname error',
    passphrase: 'passphrase error',
  }

  beforeEach(() => {
    onFormInputChange = jest.fn()
    onAuthAdd = jest.fn()
    onAuthCancel = jest.fn()

    addAuthView = shallow(
      <AddAuthView
        onFormInputChange={onFormInputChange}
        onAuthAdd={onAuthAdd}
        onAuthCancel={onAuthCancel}
        addAuthErrors={addAuthErrors}
      />,
    )
  })

  describe('rendering', () => {
    describe('the private key input field', () => {
      let privateKeyInput: ShallowWrapper<any, any>

      beforeEach(() => {
        privateKeyInput = addAuthView.find(FloatingInput).at(0)
      })

      it('is the correct type of Component', () => {
        expect(privateKeyInput.prop('inputType')).toEqual('password')
      })

      it('has a private key placeholder', () => {
        expect(privateKeyInput.prop('placeholder')).toEqual('Private Key')
      })

      it('has a private key error string', () => {
        expect(privateKeyInput.prop('error')).toEqual('private key error')
      })

      describe('on input', () => {
        beforeEach(() => {
          const event = { currentTarget: { value: 'privateKey' } } as any
          privateKeyInput.prop('onInput')(event)
        })

        it('calls onFormChange with the correct value', () => {
          expect(onFormInputChange).toHaveBeenCalledWith({ privateKey: 'privateKey' })
        })
      })
    })
  })

  describe('the nickname input field', () => {
    let nicknameInput: ShallowWrapper<any, any>

    beforeEach(() => {
      nicknameInput = addAuthView.find(FloatingInput).at(1)
    })

    it('is the correct type of Component', () => {
      expect(nicknameInput.prop('inputType')).toEqual('text')
    })

    it('has a Nickname placeholder', () => {
      expect(nicknameInput.prop('placeholder')).toEqual('Nickname')
    })

    it('has a nickname error string', () => {
      expect(nicknameInput.prop('error')).toEqual('nickname error')
    })

    describe('on input', () => {
      beforeEach(() => {
        const event = { currentTarget: { value: 'nickname' } } as any
        nicknameInput.prop('onInput')(event)
      })

      it('calls onFormChange with the correct value', () => {
        expect(onFormInputChange).toHaveBeenCalledWith({ nickname: 'nickname' })
      })
    })
  })

  describe('the passphrase input field', () => {
    let passphraseInput: ShallowWrapper<any, any>

    beforeEach(() => {
      passphraseInput = addAuthView.find(FloatingInput).at(2)
    })

    it('is a toggleable password input', () => {
      expect(passphraseInput.prop('toggleablePassword')).toBe(true)
    })

    it('has a Passphrase placeholder', () => {
      expect(passphraseInput.prop('placeholder')).toEqual('Passphrase')
    })

    it('has a passphrase error string', () => {
      expect(passphraseInput.prop('error')).toEqual('passphrase error')
    })

    describe('on input', () => {
      beforeEach(() => {
        const event = { currentTarget: { value: 'passphrase' } } as any
        passphraseInput.prop('onInput')(event)
      })

      it('calls onFormChange with the correct value', () => {
        expect(onFormInputChange).toHaveBeenCalledWith({ passphrase: 'passphrase' })
      })
    })
  })

  describe('the save auth button', () => {
    let footerButton: any

    it('has the save text', () => {
      footerButton = addAuthView.find(Button).at(1)
      const text = footerButton.childAt(0).text()
      expect(text).toBe('Save')
    })
  })

  describe('the cancel auth button', () => {
    let footerButton: ShallowWrapper

    beforeEach(() => {
      footerButton = addAuthView.find(Button).first()
    })

    it('has the cancel text', () => {
      expect(footerButton.childAt(0).text()).toBe('Cancel')
    })

    it('calls onAuthCancel when add auth is cancelled', () => {
      const event: any = {}
      addAuthView.find('#cancelAuth').prop('onClick')(event)

      expect(onAuthCancel).toHaveBeenCalled()
    })
  })

  describe('the form', () => {
    let form: ShallowWrapper
    let event: any
    let onSubmit: (e: any) => void

    beforeEach(() => {
      form = addAuthView.find(FormLayout)
      event = {
        preventDefault: jest.fn(),
      }

      onSubmit = form.prop('onSubmit')
      onSubmit(event)
    })

    it('calls onAuthAdd on submit', () => {
      expect(onAuthAdd).toHaveBeenCalledWith()
    })

    it('prevents the default submit behavior', () => {
      expect(event.preventDefault).toHaveBeenCalled()
    })
  })
})
