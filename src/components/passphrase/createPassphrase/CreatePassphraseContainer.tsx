import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'

import CreatePassphraseForm, {
  CreatePassphraseFormInputs,
} from 'components/passphrase/createPassphrase/CreatePassphraseForm'
import { Dispatch } from 'store/storeHelpers'
import { passphraseAdd } from 'store/passphrase/passphraseActions'
import RoutePath from 'constants/routePath'
import PassphraseValidator from 'utils/passphrase/PassphraseValidator'

interface Props extends RouteComponentProps {
  onPassphraseAdd: (phrase: string) => void
}

export class CreatePassphraseContainer extends React.Component<Props, CreatePassphraseFormInputs> {
  public static displayName = 'CreatePassphraseContainer'
  private passphraseValidator: PassphraseValidator

  constructor(props: Props) {
    super(props)

    this.passphraseValidator = new PassphraseValidator()
    this.state = {
      passphrase: '',
      confirmPassphrase: '',
    }
  }

  public render() {
    const { passphrase, confirmPassphrase } = this.state
    return(
      <CreatePassphraseForm
        passphrase={this.state.passphrase}
        onFormInputChange={this.onFormInputChange}
        onCreatePassphrase={this.onCreatePassphrase}
        passphraseRequirements={this.passphraseValidator.validatePassphrase(passphrase, confirmPassphrase)}
      />
    )
  }

  private onCreatePassphrase = (passphrase: string) => {
    this.props.onPassphraseAdd(passphrase.trim())
    this.props.history.replace(RoutePath.AUTHS)
  }

  private onFormInputChange = (formInputs: Pick<CreatePassphraseFormInputs, keyof CreatePassphraseFormInputs>) => {
    this.setState(formInputs)
  }
}

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  onPassphraseAdd: (phrase: string) => dispatch(passphraseAdd(phrase)),
})

export default withRouter(connect(null, mapDispatchToProps)(CreatePassphraseContainer))
