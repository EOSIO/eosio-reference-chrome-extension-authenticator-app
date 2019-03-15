import * as React from 'react'

import './ConfirmPassphraseView.css'

import FormLayout from 'components/shared/layout/FormLayout'
import NavBar from 'components/navigation/NavBar'
import BodyView from 'components/shared/layout/BodyView'
import FooterView from 'components/shared/layout/FooterView'
import Button from 'components/shared/button/Button'
import FloatingInput from 'components/shared/input/FloatingInput'

interface Props {
  onConfirmPassphrase: (passphrase: string) => void
  error: string
}

interface State {
  passphrase: string
  show: boolean
}

export default class ConfirmPassphraseView extends React.Component<Props, State> {
  public static displayName = 'ConfirmPassphraseView'

  public state: State = {
    passphrase: '',
    show: false,
  }

  public render() {
    return (
      <FormLayout onSubmit={this.onSubmit}>
        <NavBar />
        <BodyView>
          <div className='confirm-passphrase'>
            <div className='confirm-passphrase-heading'>
              <h1 className='confirm-passphrase-title'>Confirm your Passphrase</h1>
              <p className='confirm-passphrase-body'>
                For your continued security, enter the passphrase you used to initially setup your account.
              </p>
            </div>
            <FloatingInput
              error={this.props.error}
              placeholder='Confirm Passphrase'
              onInput={(e: React.FormEvent<HTMLInputElement>) => this.setState({ passphrase: e.currentTarget.value })}
              toggleablePassword
            />
          </div>
        </BodyView>
        <FooterView>
          <Button
            type='submit'
          >
            Continue
          </Button>
        </FooterView>
      </FormLayout>
    )
  }

  private onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    this.props.onConfirmPassphrase(this.state.passphrase)
  }
}
