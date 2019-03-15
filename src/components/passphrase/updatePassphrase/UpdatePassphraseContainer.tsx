import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'store/storeHelpers'
import { sha256 } from 'hash.js'

import AppState from 'store/AppState'
import UpdatePassphraseView from 'components/passphrase/updatePassphrase/UpdatePassphraseView'
import { passphraseUpdate } from 'store/passphrase/passphraseActions'
import PassphraseValidator from 'utils/passphrase/PassphraseValidator'
import { UpdatePassphraseFormInputs } from 'components/passphrase/updatePassphrase/UpdatePassphraseForm'

const PASSPHRASE_ERROR = 'Invalid Passphrase'

interface Props {
  onPassphraseUpdate: (currentPassphrase: string, newPassphrase: string) => void
  passphraseHash: string
}

interface State extends UpdatePassphraseFormInputs {
  error: string,
}

export class UpdatePassphraseContainer extends React.Component<Props, State> {
  public static displayName = 'UpdatePassphraseContainer'
  private passphraseValidator: PassphraseValidator

  constructor(props: Props) {
    super(props)

    this.passphraseValidator = new PassphraseValidator()
    this.state = {
      currentPassphrase: '',
      newPassphrase: '',
      confirmPassphrase: '',
      error: '',
    }
  }

  public render() {
    return (
      <UpdatePassphraseView
        currentPassphrase={this.state.currentPassphrase}
        newPassphrase={this.state.newPassphrase}
        confirmPassphrase={this.state.confirmPassphrase}
        onFormSubmit={this.onFormSubmit}
        onFormInputChange={this.onFormInputChange}
        resetForm={this.resetForm}
        // tslint:disable-next-line:max-line-length
        passphraseRequirements={this.passphraseValidator.validatePassphrase(this.state.newPassphrase, this.state.confirmPassphrase)}
        error={this.state.error}
      />
    )
  }

  private onFormInputChange = (formInputs: Pick<UpdatePassphraseFormInputs, keyof UpdatePassphraseFormInputs>) => {
    this.setState(formInputs)
  }

  private onFormSubmit = async (): Promise<boolean> => {
    const { currentPassphrase, newPassphrase } = this.state

    if (sha256().update(currentPassphrase).digest('hex') !== this.props.passphraseHash) {
      this.setState({ error: PASSPHRASE_ERROR })
      return false
    }

    await this.props.onPassphraseUpdate(currentPassphrase, newPassphrase)

    return true
  }

  private resetForm = () => {
    this.setState({
      currentPassphrase: '',
      newPassphrase: '',
      confirmPassphrase: '',
      error: '',
    })
  }
}

export const mapStateToProps = (state: AppState) => ({
  passphraseHash: state.passphraseHash.data,
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  onPassphraseUpdate: async (currentPassphrase: string, newPassphrase: string) => {
    await dispatch(passphraseUpdate(currentPassphrase, newPassphrase))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePassphraseContainer)
