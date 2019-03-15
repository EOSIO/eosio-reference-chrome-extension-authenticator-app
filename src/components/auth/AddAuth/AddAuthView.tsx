import * as React from 'react'
import './AddAuthView.css'

import Button from 'components/shared/button/Button'
import FormLayout from 'components/shared/layout/FormLayout'
import BodyView from 'components/shared/layout/BodyView'
import FloatingInput from 'components/shared/input/FloatingInput'
import FooterView from 'components/shared/layout/FooterView'

export interface AddAuthFormInputs {
  privateKey: string
  nickname: string
  passphrase: string
}

interface Props {
  onFormInputChange: (formInputs: Partial<AddAuthFormInputs>) => void
  onAuthAdd: () => void
  onAuthCancel: () => void
  addAuthErrors: AddAuthFormInputs
}

const AddAuthView: React.SFC<Props> = ({
  onFormInputChange: onFormChange,
  onAuthAdd,
  onAuthCancel,
  addAuthErrors,
}: Props) => {
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAuthAdd()
  }

  return (
    <FormLayout onSubmit={onSubmit}>
      <BodyView>
        <div className='add-auth'>
          <div className='add-auth-heading'>
            <h1 className='add-auth-title'>Add Auth</h1>
            <p className='add-auth-info'>
              Securely store additional Authenticators below by pasting in Private Keys.
              Importing your Accounts into the EOSIO Reference Chrome Extension
              Authenticator App will allow you to transact seamlessly.
            </p>
          </div>

          <div className='add-auth-input-container'>
            <FloatingInput
              placeholder='Private Key'
              error={addAuthErrors.privateKey}
              onInput={(e) => onFormChange({ privateKey: e.currentTarget.value })}
              inputType='password'
            />
            <FloatingInput
              placeholder='Nickname'
              error={addAuthErrors.nickname}
              onInput={(e) => onFormChange({ nickname: e.currentTarget.value })}
            />
            <FloatingInput
              placeholder='Passphrase'
              error={addAuthErrors.passphrase}
              onInput={(e) => onFormChange({ passphrase: e.currentTarget.value })}
              toggleablePassword
            />
          </div>
        </div>
      </BodyView>
      <FooterView>
        <Button
          id='cancelAuth'
          onClick={onAuthCancel}
          type='button'
          secondaryStyle
        >
          Cancel
        </Button>
        <Button
          type='submit'
        >
          Save
        </Button>
      </FooterView>
    </FormLayout>
  )
}

AddAuthView.displayName = 'AddAuthView'
export default AddAuthView
