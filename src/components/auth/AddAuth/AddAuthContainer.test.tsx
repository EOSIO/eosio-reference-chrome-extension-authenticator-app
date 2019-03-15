import '__mocks__/chrome.mock'
import 'utils/__mocks__/encrypter.mock'
import * as dappMessengerMocks from 'utils/__mocks__/DappMessenger.mock'

import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import * as ecc from 'eosjs-ecc'
import * as hashjs from 'hash.js'

import { AddAuthContainer, mapDispatchToProps, ERROR_MESSAGES } from 'components/auth/AddAuth/AddAuthContainer'
import AddAuthView from 'components/auth/AddAuth/AddAuthView'
import Auth from 'utils/Auth'
import * as authsActions from 'store/auths/authsActions'
import { AddAuthFormInputs } from 'components/auth/AddAuth/AddAuthView'

describe('AddAuthContainer', () => {
  let addAuthContainer: ShallowWrapper
  let dispatch: jest.Mock
  let onAuthAdd: jest.Mock
  let auth: Auth
  let history: any
  let addAuthErrors: AddAuthFormInputs

  beforeEach(() => {
    auth = {
      nickname: 'nickname1',
      publicKey: 'publicKey1',
      encryptedPrivateKey: 'privateKey1',
    }

    history = {
      push: jest.fn(),
      goBack: jest.fn(),
    }

    dispatch = jest.fn()
    onAuthAdd = jest.fn()

    dappMessengerMocks.sendMessage.mockReset()

    addAuthContainer = shallow(
      <AddAuthContainer
        history={history}
        onAuthAdd={onAuthAdd}
        passphraseHash='hashedPassphrase'
        auths={[auth]}
        location={null}
        match={null}
      />,
    )
  })

  describe('when the form input changes', () => {
    beforeEach(() => {
      addAuthContainer.setState({
        privateKey: '',
        nickname: '',
        passphrase: '',
        addAuthErrors: {},
      })
      addAuthContainer.find(AddAuthView).prop('onFormInputChange')({ nickname: 'nickname2', passphrase: 'passphrase2' })
    })

    it('updates the state with the input values', () => {
      expect(addAuthContainer.state()).toEqual({
        privateKey: '',
        nickname: 'nickname2',
        passphrase: 'passphrase2',
        addAuthErrors: {},
      })
    })
  })

  describe('when the user adds an auth', () => {
    describe('when there are no errors', () => {
      beforeEach(() => {
        addAuthContainer.setState({
          privateKey: 'privateKey2',
          nickname: 'nickname2',
          passphrase: 'passphrase2',
          addAuthErrors: {},
        })

        jest.spyOn(ecc, 'isValidPrivate').mockReturnValue(true)
        jest.spyOn(ecc, 'privateToPublic').mockReturnValue('pubKey2')
        jest.spyOn(hashjs, 'sha256').mockReturnValue({
          update: jest.fn().mockReturnValue({
            digest: jest.fn().mockReturnValue('hashedPassphrase'),
          }),
        })
        addAuthContainer.find(AddAuthView).prop('onAuthAdd')()
      })

      it('calls the auth add callback', () => {
        expect(onAuthAdd).toHaveBeenCalledWith('nickname2', 'privateKey2', 'passphrase2')
      })

      it('navigates to the auths page', () => {
        expect(history.goBack).toHaveBeenCalled()
      })
    })

    describe('when there are errors', () => {
      describe('any error', () => {
        beforeEach(() => {
          addAuthContainer.setState({
            privateKey: 'privateKey2',
            nickname: 'nickname2',
            passphrase: 'passphrase2',
            addAuthErrors: {},
          })

          jest.spyOn(ecc, 'isValidPrivate').mockReturnValue(false)
          addAuthContainer.find(AddAuthView).prop('onAuthAdd')()
        })

        it('should not invoke the auth add callback', () => {
          expect(onAuthAdd).not.toHaveBeenCalled()
        })

        it('should not navigate to the auths page', () => {
          expect(history.goBack).not.toHaveBeenCalled()
        })
      })

      describe('nickname error', () => {
        describe('when there are duplicate nicknames', () => {
          beforeEach(() => {
            addAuthContainer.setState({
              privateKey: 'privateKey2',
              nickname: 'nickname1',
              passphrase: 'passphrase2',
              addAuthErrors: {},
            })

            jest.spyOn(ecc, 'isValidPrivate').mockReturnValue(true)
            addAuthContainer.find(AddAuthView).prop('onAuthAdd')()
          })

          it('should update the state with the duplicate nickname error', () => {
            addAuthContainer.find(AddAuthView).prop('onAuthAdd')()
            addAuthErrors = {
              privateKey: '',
              nickname: ERROR_MESSAGES.DUPLICATE_NICKNAME,
              passphrase: '',
            }

            expect(addAuthContainer.state()).toEqual({
              privateKey: 'privateKey2',
              nickname: 'nickname1',
              passphrase: 'passphrase2',
              addAuthErrors,
            })
          })
        })

        describe('when the nickame is empty', () => {
          beforeEach(() => {
            addAuthContainer.setState({
              privateKey: 'privateKey2',
              nickname: '',
              passphrase: 'passphrase2',
              addAuthErrors: {},
            })

            jest.spyOn(ecc, 'isValidPrivate').mockReturnValue(true)
            addAuthContainer.find(AddAuthView).prop('onAuthAdd')()
          })

          it('should update the state with the invalid nickname error', () => {
            addAuthErrors = {
              privateKey: '',
              nickname: ERROR_MESSAGES.INVALID_NICKNAME,
              passphrase: '',
            }

            expect(addAuthContainer.state()).toEqual({
              privateKey: 'privateKey2',
              nickname: '',
              passphrase: 'passphrase2',
              addAuthErrors,
            })
          })
        })
      })

      describe('private key errors', () => {
        describe('when there are duplicate private keys', () => {
          beforeEach(() => {
            addAuthContainer.setState({
              privateKey: 'privateKey2',
              nickname: 'nickname2',
              passphrase: 'passphrase2',
              addAuthErrors: {},
            })

            jest.spyOn(ecc, 'isValidPrivate').mockReturnValue(true)
            jest.spyOn(ecc, 'privateToPublic').mockReturnValue('publicKey1')
            addAuthContainer.find(AddAuthView).prop('onAuthAdd')()
          })

          it('should update state with duplicate private key error', () => {
            addAuthErrors = {
              privateKey: ERROR_MESSAGES.DUPLICATE_PRIVATE_KEY,
              nickname: '',
              passphrase: '',
            }

            expect(addAuthContainer.state()).toEqual({
              privateKey: 'privateKey2',
              nickname: 'nickname2',
              passphrase: 'passphrase2',
              addAuthErrors,
            })
          })
        })

        describe('when the private key is invalid', () => {
          beforeEach(() => {
            addAuthContainer.setState({
              privateKey: 'privateKey2',
              nickname: 'nickname2',
              passphrase: 'passphrase2',
              addAuthErrors: {},
            })

            jest.spyOn(ecc, 'isValidPrivate').mockReturnValue(false)
            addAuthContainer.find(AddAuthView).prop('onAuthAdd')()
          })

          it('should update state with invalid private key error', () => {
            addAuthErrors = {
              privateKey: ERROR_MESSAGES.INVALID_PRIVATE_KEY,
              nickname: '',
              passphrase: '',
            }

            expect(addAuthContainer.state()).toEqual({
              privateKey: 'privateKey2',
              nickname: 'nickname2',
              passphrase: 'passphrase2',
              addAuthErrors,
            })
          })
        })
      })

      describe('passphrase error', () => {
        beforeEach(() => {
          addAuthContainer.setState({
            privateKey: 'privateKey2',
            nickname: 'nickname2',
            passphrase: 'passphrase2',
            addAuthErrors: {},
          })

          jest.spyOn(ecc, 'isValidPrivate').mockReturnValue(true)
          jest.spyOn(ecc, 'privateToPublic').mockReturnValue('publicKey2')

          jest.spyOn(hashjs, 'sha256').mockReturnValue({
            update: jest.fn().mockReturnValue({
              digest: jest.fn().mockReturnValue('badHash'),
            }),
          })

          addAuthContainer.find(AddAuthView).prop('onAuthAdd')()
        })

        it('should update state with passphrase error', () => {
          addAuthErrors = {
            privateKey: '',
            nickname: '',
            passphrase: ERROR_MESSAGES.INVALID_PASSPHRASE,
          }

          expect(addAuthContainer.state()).toEqual({
            privateKey: 'privateKey2',
            nickname: 'nickname2',
            passphrase: 'passphrase2',
            addAuthErrors,
          })
        })
      })
    })
  })

  describe('when the user cancels an auth', () => {
    beforeEach(() => {
      addAuthContainer.find(AddAuthView).prop('onAuthCancel')()
    })

    it('pops to previous page (auths)', () => {
      expect(history.goBack).toHaveBeenCalled()
    })
  })

  describe('rendering', () => {
    it('renders the AddAuthView', () => {
      /* tslint:disable:no-string-literal */
      expect(addAuthContainer.find(AddAuthView).props()).toEqual({
        onFormInputChange: addAuthContainer.instance()['onFormInputChange'],
        onAuthAdd: addAuthContainer.instance()['onAuthAdd'],
        onAuthCancel: addAuthContainer.instance()['onAuthCancel'],
        addAuthErrors: {
          privateKey: '',
          nickname: '',
          passphrase: '',
        },
      })
      /* tslint:enable:no-string-literal */
    })
  })

  it('maps authAdd prop to authAdd action', () => {
    const { onAuthAdd: dispatchAuthAdd } = mapDispatchToProps(dispatch)

    jest.spyOn(authsActions, 'authAdd').mockReturnValue('auth add action')

    dispatchAuthAdd('name', 'privateKey', 'blah')
    expect(dispatch).toHaveBeenCalledWith('auth add action')
  })
})
