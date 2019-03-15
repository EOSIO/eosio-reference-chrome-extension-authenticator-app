import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import { sha256 } from 'hash.js'
import { isValidPrivate, privateToPublic } from 'eosjs-ecc'

import AddAuthView from 'components/auth/AddAuth/AddAuthView'
import { AddAuthFormInputs } from 'components/auth/AddAuth/AddAuthView'
import { Dispatch } from 'store/storeHelpers'
import { authAdd } from 'store/auths/authsActions'
import AppState from 'store/AppState'
import Auth from 'utils/Auth'

export const ERROR_MESSAGES = {
  INVALID_PRIVATE_KEY: 'Invalid private key',
  INVALID_PASSPHRASE: 'Invalid passphrase',
  INVALID_NICKNAME: 'Invalid nickname',
  DUPLICATE_NICKNAME: 'Nickname already exists',
  DUPLICATE_PRIVATE_KEY: 'Private key already exists',
}

interface Props extends RouteComponentProps {
  onAuthAdd: (nickname: string, privateKey: string, passphrase: string) => void
  passphraseHash: string
  auths: Auth[]
}

interface State extends AddAuthFormInputs {
  addAuthErrors: AddAuthFormInputs
}

export class AddAuthContainer extends React.Component<Props, State> {
  public static displayName = 'AddAuthContainer'
  public state: State = {
    privateKey: '',
    nickname: '',
    passphrase: '',
    addAuthErrors: {
      privateKey: '',
      nickname: '',
      passphrase: '',
    },
  }

  public render() {
    return (
      <AddAuthView
        onFormInputChange={this.onFormInputChange}
        onAuthAdd={this.onAuthAdd}
        onAuthCancel={this.onAuthCancel}
        addAuthErrors={this.state.addAuthErrors}
      />
    )
  }

  private onFormInputChange = (formInputs: Pick<State, keyof State>) => {
    this.setState(formInputs)
  }

  private onAuthAdd = () => {
    const { nickname, privateKey, passphrase } = this.state
    const addAuthErrors: AddAuthFormInputs = this.validateAuth(nickname, privateKey, passphrase)
    const hasAuthError = Object.keys(addAuthErrors).find((authError) => addAuthErrors[authError] !== '')

    if (!hasAuthError) {
      this.props.onAuthAdd(nickname, privateKey, passphrase)
      this.props.history.goBack()
      return
    }

    this.setState({ addAuthErrors })
  }

  private onAuthCancel = () => {
    this.props.history.goBack()
  }

  private validateAuth = (nickname: string, privateKey: string, passphrase: string): AddAuthFormInputs => {
    let privateKeyError = ''
    let nicknameError = ''
    let passphraseError = ''

    if (!isValidPrivate(privateKey)) {
      privateKeyError = ERROR_MESSAGES.INVALID_PRIVATE_KEY
    }

    if (!privateKeyError && this.auths.find((auth) => auth.publicKey === privateToPublic(privateKey))) {
      privateKeyError = ERROR_MESSAGES.DUPLICATE_PRIVATE_KEY
    }

    if (sha256().update(passphrase).digest('hex') !== this.props.passphraseHash) {
      passphraseError = ERROR_MESSAGES.INVALID_PASSPHRASE
    }

    if (!nickname) {
      nicknameError = ERROR_MESSAGES.INVALID_NICKNAME
    } else if (this.props.auths.find((auth) => auth.nickname === nickname)) {
      nicknameError = ERROR_MESSAGES.DUPLICATE_NICKNAME
    }

    return {
      privateKey: privateKeyError,
      nickname: nicknameError,
      passphrase: passphraseError,
    }
  }

  private get auths(): Auth[] {
    return this.props.auths
  }
}

export const mapStateToProps = (state: AppState) => ({
  passphraseHash: state.passphraseHash.data,
  auths: state.auths.data,
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  onAuthAdd: (nickname: string, privateKey: string, passphrase: string) => {
    dispatch(authAdd(nickname, privateKey, passphrase))
  },
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddAuthContainer))
