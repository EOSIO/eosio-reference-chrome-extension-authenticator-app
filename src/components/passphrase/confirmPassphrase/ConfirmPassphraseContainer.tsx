import * as React from 'react'
import { connect } from 'react-redux'
import { sha256 } from 'hash.js'

import ConfirmPassphraseView from 'components/passphrase/confirmPassphrase/ConfirmPassphraseView'
import AppState from 'store/AppState'

const MAX_ATTEMPTS = 3
const PASSPHRASE_ERROR = 'Invalid Passphrase'

interface Props {
  passphraseHash: string
  onConfirmPassphrase: (phrase: string) => void
  onFailPassphrase: () => void
}

interface State {
  attempts: number
  error: string
}

export class ConfirmPassphraseContainer extends React.Component<Props, State> {

  public state: State = {
    attempts: 1,
    error: '',
  }

  public render() {
    return (
      <ConfirmPassphraseView
        onConfirmPassphrase={this.onConfirmPassphrase}
        error={this.state.error}
      />
    )
  }

  private onConfirmPassphrase = (passphrase: string) => {
    if (sha256().update(passphrase).digest('hex') !== this.props.passphraseHash) {
      this.setState(({attempts}) => ({
        attempts: attempts + 1,
        error: PASSPHRASE_ERROR,
      }), () => {
        if (this.state.attempts > MAX_ATTEMPTS) {
          this.props.onFailPassphrase()
          return
        }
      })

      return
    }

    this.props.onConfirmPassphrase(passphrase)
  }
}

export const mapStateToProps = (state: AppState) => ({
  passphraseHash: state.passphraseHash.data,
})

export default connect(mapStateToProps)(ConfirmPassphraseContainer)
