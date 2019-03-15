import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'

import FloatingInput from 'components/shared/input/FloatingInput'
import showPassphraseIcon from 'assets/images/show-passphrase.svg'
import hidePassphraseIcon from 'assets/images/hide-passphrase.svg'

describe('FloatingInput', () => {
  let floatingInput: ShallowWrapper
  let onInput: jest.Mock
  let inputEvent: any

  describe('Toggleable passphrase input', () => {
    beforeEach(() => {
      onInput = jest.fn()
      inputEvent = {
        currentTarget: { value: 'passphrase' },
      }
      floatingInput = shallow(
        <FloatingInput
          placeholder='passphrase input'
          onInput={onInput}
          toggleablePassword
        />,
      )
    })

    it('should render a label with the placeholder', () => {
      expect(floatingInput.find('label').text()).toBe('passphrase input')
    })

    it('should render an input field with default type password', () => {
      expect(floatingInput.find('input').prop('type')).toBe('password')
    })

    it('should render a showPassphraseIcon', () => {
      expect(floatingInput.find('img').prop('src')).toBe(showPassphraseIcon)
    })

    describe('clicking showPassphraseIcon', () => {
      beforeEach(() => {
        floatingInput.find('img').simulate('click')
      })

      it('should toggle the passphrase input type', () => {
        expect(floatingInput.find('input').prop('type')).toBe('text')
      })

      it('should render a hidePassphrase Icon', () => {
        expect(floatingInput.find('img').prop('src')).toBe(hidePassphraseIcon)
      })
    })

    it('enter text in the input field should invoke the onInput callback', () => {
      floatingInput.find('input').prop('onChange')(inputEvent)
      expect(onInput).toHaveBeenCalledWith(inputEvent)
    })
  })

  describe('Non toggleable input', () => {
    beforeEach(() => {
      onInput = jest.fn()
      inputEvent = {
        currentTarget: { value: 'text' },
      }
      floatingInput = shallow(
        <FloatingInput
          placeholder='password input'
          onInput={onInput}
          inputType='password'
        />,
      )
    })

    it('should render an label with the placeholder', () => {
      expect(floatingInput.find('label').text()).toBe('password input')
    })

    it('should render an input of type inputType', () => {
      expect(floatingInput.find('input').prop('type')).toBe('password')
    })

    it('enter text in the input field should invoke the onInput callback', () => {
      floatingInput.find('input').prop('onChange')(inputEvent)
      expect(onInput).toHaveBeenCalledWith(inputEvent)
    })

    it('should update the value of the input when the value prop changes', () => {
      floatingInput.setProps({ value: 'test' })
      expect(floatingInput.find('input').prop('value')).toBe('test')
    })
  })

  describe('When inputType is not specified', () => {
    beforeEach(() => {
      floatingInput = shallow(
        <FloatingInput
          placeholder='text input'
          onInput={onInput}
        />,
      )
    })

    it('should render an input with type text', () => {
      expect(floatingInput.find('input').prop('type')).toBe('text')
    })
  })

  describe('When an error occurs', () => {
    beforeEach(() => {
      floatingInput = shallow(
        <FloatingInput
          placeholder='text input'
          onInput={onInput}
          error='input error'
        />,
      )
    })

    it('should render error text', () => {
      expect(floatingInput.find('.floating-input-error-text').text()).toBe('input error')
    })

    it('should apply the error border class', () => {
      expect(floatingInput.find('.floating-input-container').childAt(1).prop('className')).toBe(
        'floating-input-error-border',
      )
    })
  })

  describe('When a custom className is given', () => {
    beforeEach(() => {
      floatingInput = shallow(
        <FloatingInput
          placeholder='text input'
          onInput={onInput}
          error='input error'
          className='custom-class'
        />,
      )
    })

    it('should append the class to the outer div', () => {
      expect(floatingInput.find('.floating-input-container').hasClass('custom-class')).toBe(true)
    })
  })
})
