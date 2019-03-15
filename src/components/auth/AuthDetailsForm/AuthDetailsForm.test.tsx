import * as React from 'react'
import { mount, ReactWrapper } from 'enzyme'

import AuthDetailsForm from './AuthDetailsForm'
import TransitionButton from 'components/shared/transitionButton/TransitionButton'
import FloatingInput from 'components/shared/input/FloatingInput'
import { DEBOUNCE_DELAY } from 'constants/windowManager'
import { NICKNAME_ERRORS } from 'components/auth/AuthDetailsForm/AuthDetailsForm'

declare var global: any

describe('AuthDetailsForm', () => {
  let inputForm: ReactWrapper

  const auths = [
    {
      nickname: 'Account Nickname',
      encryptedPrivateKey: 'encryptedPrivateKey',
      publicKey: 'publicKey',
    },
    {
      nickname: 'Account Nickname2',
      encryptedPrivateKey: 'encryptedPrivateKey',
      publicKey: 'publicKey',
    },
  ]
  const onAuthUpdate = jest.fn()

  const handleDebounceDelay = (fn: () => void) => {
    setTimeout(fn, DEBOUNCE_DELAY + 500)
  }

  beforeEach(() => {
    inputForm = mount(
      <AuthDetailsForm
        currentAuth={auths[0]}
        auths={auths}
        onAuthUpdate={onAuthUpdate}
      />,
    )
    onAuthUpdate.mockReset()
  })

  describe('the Copy button', () => {
    const mockInputTextElement = {
      select: jest.fn(),
      blur: jest.fn(),
      removeAttribute: jest.fn(),
      setAttribute: jest.fn(),
    }
    const mockEmpty = {
      empty: jest.fn(),
    }

    global.document.getElementById = () => mockInputTextElement
    global.document.execCommand = jest.fn().mockImplementation((method) => true)
    global.window.getSelection = () => mockEmpty

    it('copies public key to clipboard', () => {
      inputForm.find(TransitionButton).prop('onClick')()
      expect(mockInputTextElement.removeAttribute).toBeCalledWith('disabled')
      expect(mockInputTextElement.select).toHaveBeenCalledTimes(1)
      expect(global.window.document.execCommand).toHaveBeenCalledWith('copy')
      expect(global.window.getSelection().empty).toBeDefined()
      expect(global.window.getSelection().empty).toHaveBeenCalledTimes(1)
      expect(mockInputTextElement.blur).toHaveBeenCalledTimes(1)
      expect(mockInputTextElement.setAttribute).toBeCalledWith('disabled', 'true')
    })

    it('sets isCopying state to true when copy is clicked', () => {
      inputForm.find(TransitionButton).prop('onClick')()
      expect(inputForm.state('isCopying')).toBe(true)
    })

    it('prevents the user from copying while the isCopying state is true', async () => {
      global.document.execCommand = jest.fn().mockImplementation((method) => true)
      inputForm.find(TransitionButton).prop('onClick')()
      await inputForm.find(TransitionButton).prop('onClick')()
      expect(global.window.document.execCommand).not.toHaveBeenCalledTimes(2)
    })

    it('logs error into state', () => {
      global.document.execCommand = jest.fn().mockImplementation((method) => false)
      inputForm.find(TransitionButton).prop('onClick')()
      expect(inputForm.state('copyError')).toBe('Error while copying to clipboard')
    })
  })

  describe('the account nickname input field', () => {
    let accountNicknameInput: ReactWrapper

    beforeEach(() => {
      accountNicknameInput = inputForm.find(FloatingInput).at(0)
    })

    it('has the expected placeholder', () => {
      expect(accountNicknameInput.prop('placeholder')).toEqual('Nickname')
    })

    it('proper account nickname from props is immediately set in component\'s state', () => {
      expect(inputForm.state('nickname')).toEqual(auths[0].nickname)
    })

    it('updates nickname in the UI but not the store if new nickname is only whitespace', (done) => {
      const newAccountNickname = '     '
      const onInput = accountNicknameInput.prop('onInput') as (e: any) => void
      const event = {
        currentTarget: {
          value: newAccountNickname,
        },
      }
      inputForm.setState({
        originalName: 'name1234',
        nickname: 'initial name',
      })
      onInput(event)
      handleDebounceDelay(() => {
        expect(inputForm.state('nickname')).toEqual(newAccountNickname)
        expect(onAuthUpdate).toHaveBeenCalledTimes(0)
        done()
      })
    })

    it('updates the account nickname in the state when changed', (done) => {
      const newAccountNickname = 'new account name'
      const onInput = accountNicknameInput.prop('onInput') as (e: any) => void
      const event = {
        currentTarget: {
          value: newAccountNickname,
        },
      }
      onInput(event)
      handleDebounceDelay(() => {
        expect(onAuthUpdate).toHaveBeenCalledTimes(1)
        expect(inputForm.state('nickname')).toEqual(newAccountNickname)
        done()
      })
    })

    it('updates nickname in the UI but not the store if new nickname is empty', (done) => {
      const newAccountNickname = ''
      const onInput = accountNicknameInput.prop('onInput') as (e: any) => void
      const event = {
        currentTarget: {
          value: newAccountNickname,
        },
      }
      inputForm.setState({
        originalName: 'name1234',
        nickname: 'initial name',
      })
      onInput(event)
      handleDebounceDelay(() => {
        expect(inputForm.state('nickname')).toEqual(newAccountNickname)
        expect(onAuthUpdate).toHaveBeenCalledTimes(0)
        done()
      })
    })

    it('doesn\'t update nickname if a chain of debounced updates results in an update with empty nickname', (done) => {
      const newAccountNickname = ''
      const onInput = accountNicknameInput.prop('onInput') as (e: any) => void
      const event = {
        currentTarget: {
          value: newAccountNickname,
        },
      }
      inputForm.setState({
        originalName: 'name1234',
        nickname: 'initial name',
      })
      // first entry
      onInput({
        currentTarget: {
          value: 'anything',
        },
      })
      // second entry (which the debounce call will process)
      onInput(event)
      handleDebounceDelay(() => {
        expect(inputForm.state('nickname')).toEqual(newAccountNickname)
        expect(onAuthUpdate).toHaveBeenCalledTimes(0)
        done()
      })
    })

    it('shows error if new nickname is empty', () => {
      const newAccountNickname = ''
      const onInput = accountNicknameInput.prop('onInput') as (e: any) => void
      const event = {
        currentTarget: {
          value: newAccountNickname,
        },
      }
      onInput(event)
      expect(inputForm.state('nickname')).toEqual(newAccountNickname)
      expect(inputForm.state('nicknameError')).toBe(NICKNAME_ERRORS.INVALID_NICKNAME)
    })

    // tslint:disable-next-line:max-line-length
    it('doesn\'t save nickname if a chain of debounce updates result in an update with an existing nickname', (done) => {
      const newAccountNickname = 'Account Nickname2'
      const onInput = accountNicknameInput.prop('onInput') as (e: any) => void
      const event = {
        currentTarget: {
          value: newAccountNickname,
        },
      }
      inputForm.setState({
        originalName: 'name1234',
        nickname: 'initial name',
      })
      // first entry
      onInput({
        currentTarget: {
          value: 'anything',
        },
      })
      // second entry (which the debounce call will process)
      onInput(event)
      handleDebounceDelay(() => {
        expect(inputForm.state('nickname')).toEqual(newAccountNickname)
        expect(onAuthUpdate).toHaveBeenCalledTimes(0)
        done()
      })
    })

    it('shows error if the new nickname already exists', () => {
      const newAccountNickname = 'Account Nickname2'
      const onInput = accountNicknameInput.prop('onInput') as (e: any) => void
      const event = {
        currentTarget: {
          value: newAccountNickname,
        },
      }
      onInput(event)
      expect(inputForm.state('nickname')).toEqual(newAccountNickname)
      expect(inputForm.state('nicknameError')).toBe(NICKNAME_ERRORS.DUPLICATE_NICKNAME)
    })

    it('debounces the form submission', (done) => {
      const event = {
        currentTarget: {
          value: 'new acct name',
        },
      }
      const onInput = accountNicknameInput.prop('onInput') as (e: any) => void
      onInput(event)
      handleDebounceDelay(() => {
        expect(onAuthUpdate).toHaveBeenCalledTimes(1)
        done()
      })
    })
  })

  describe('the public key field', () => {
    let publicKeyInput: ReactWrapper

    beforeEach(() => {
      publicKeyInput = inputForm.find(FloatingInput).at(1)
    })

    it('has the expected placeholder', () => {
      expect(publicKeyInput.prop('placeholder')).toEqual('Public Key')
    })

    it('is disabled', () => {
      expect(publicKeyInput.prop('disabled')).toBe(true)
    })

    it('shows proper public key', () => {
      expect(publicKeyInput.prop('value')).toEqual(auths[0].publicKey)
    })

    it('proper public key is immediately set in component\'s state', () => {
      expect(inputForm.state('publicKey')).toEqual(auths[0].publicKey)
    })
  })

  describe('the update Auth action', () => {
    const event: any = {
      currentTarget: {
        value: 'new acct name',
      },
    }
    it('updates this auth\'s nickname in the redux store', (done) => {
      inputForm.find(FloatingInput).at(0).prop('onInput')(event)
      handleDebounceDelay(() => {
        expect(onAuthUpdate).toHaveBeenCalledTimes(1)
        done()
      })
    })
  })
})
