import * as React from 'react'
import './UpdatePassphraseForm.css'

import TransitionButton from 'components/shared/transitionButton/TransitionButton'
import FloatingInput from 'components/shared/input/FloatingInput'
import { PassphraseRequirements } from 'utils/passphrase/PassphraseValidator'
import checkMarkIcon from 'assets/images/checkmark-icon.svg'
import './UpdatePassphraseForm.css'

export interface UpdatePassphraseFormInputs {
  newPassphrase: string
  currentPassphrase: string
  confirmPassphrase: string
}

interface Props {
  newPassphrase: string
  currentPassphrase: string
  confirmPassphrase: string
  onFormSubmit: () => Promise<boolean>
  onFormInputChange: (formInputs: Partial<UpdatePassphraseFormInputs>) => void,
  resetForm: () => void
  passphraseRequirements: PassphraseRequirements
  error: string
}

interface State {
  loading: boolean
}

class UpdatePassphraseForm extends React.Component<Props, State> {
  public static displayName = 'UpdatePassphraseForm'

  public state: State = {
    loading: false,
  }

  private transitionButtonRef: React.RefObject<TransitionButton>

  constructor(props: Props) {
    super(props)
    this.transitionButtonRef = React.createRef()
  }

  public render() {
    const { isLong, isUnique, isMatching } = this.props.passphraseRequirements
    return (
      <form
        className='update-passphrase-form'
        onSubmit={this.onSubmit}
      >
        <FloatingInput
          placeholder='Current Passphrase'
          toggleablePassword
          error={this.props.error}
          onInput={(e) => this.props.onFormInputChange({ currentPassphrase: e.currentTarget.value })}
          value={this.props.currentPassphrase}
        />
        <FloatingInput
          placeholder='New Passphrase'
          toggleablePassword
          onInput={(e) => this.props.onFormInputChange({ newPassphrase: e.currentTarget.value })}
          value={this.props.newPassphrase}
        />
        <FloatingInput
          placeholder='Confirm Passphrase'
          toggleablePassword
          onInput={(e) => this.props.onFormInputChange({ confirmPassphrase: e.currentTarget.value })}
          value={this.props.confirmPassphrase}
        />
        <div className='passphrase-requirement'>
          {isLong && <img src={checkMarkIcon} alt='checkMarkIcon' />} <p>Must be at least 4 words long</p>
        </div>
        <div className='passphrase-requirement'>
          {isUnique && isLong && <img src={checkMarkIcon} alt='checkMarkIcon' />} <p>Each word must be unique</p>
        </div>
        <div className='passphrase-requirement'>
          {
            isUnique
            && isLong
            && isMatching
            && <img src={checkMarkIcon} alt='checkMarkIcon' />
          }
          <p>Passphrases must match</p>
        </div>
        <TransitionButton
          ref={this.transitionButtonRef}
          text='Update Passphrase'
          successText='Passphrase Updated!'
          loadingText='Updating Passphrase...'
          errorText='Update Passphrase Failed'
          type='submit'
          disabled={!isLong || !isUnique || !isMatching}
        />
      </form>
    )
  }

  private onSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const { onFormSubmit, resetForm } = this.props
    const { loading } = this.state

    if (loading) { return }

    this.setState({ loading: true })
    this.transitionButtonRef.current.animateLoading(async () => {
      if (await onFormSubmit()) {
        this.transitionButtonRef.current.animateSuccess(true, () => {
          this.setState({ loading: false })
          resetForm()
        })
      } else {
        this.transitionButtonRef.current.animateError(() => {
          this.setState({ loading: false })
        })
      }
    })
  }
}

UpdatePassphraseForm.displayName = 'UpdatePassphraseForm'

export default UpdatePassphraseForm
