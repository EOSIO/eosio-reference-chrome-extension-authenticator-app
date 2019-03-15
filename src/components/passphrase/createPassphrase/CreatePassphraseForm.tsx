import * as React from 'react'
import './CreatePassphraseForm.css'

import { PassphraseRequirements } from 'utils/passphrase/PassphraseValidator'
import FooterView from 'components/shared/layout/FooterView'
import FormLayout from 'components/shared/layout/FormLayout'
import BodyView from 'components/shared/layout/BodyView'
import Button from 'components/shared/button/Button'
import FloatingInput from 'components/shared/input/FloatingInput'
import checkMarkIcon from 'assets/images/checkmark-icon.svg'

export interface CreatePassphraseFormInputs {
  passphrase: string
  confirmPassphrase: string
}

interface Props {
  passphrase: string,
  onFormInputChange: (formInputs: Partial<CreatePassphraseFormInputs>) => void
  onCreatePassphrase: (phrase: string) => void
  passphraseRequirements: PassphraseRequirements
}

const CreatePassphraseForm: React.SFC<Props> = ({
  passphrase,
  onFormInputChange,
  onCreatePassphrase,
  passphraseRequirements,
}) => {

  const { isLong, isUnique, isMatching } = passphraseRequirements

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreatePassphrase(passphrase)
  }

  return (
    <FormLayout onSubmit={onSubmit}>
        <BodyView>
          <div className='create-passphrase'>
            <div className='create-passphrase-heading'>
              <h1 className='create-passphrase-title'>Create a Passphrase</h1>
              <p className='create-passphrase-body'>
                In order to ensure you have the best security for your account, we’ll need you to create a passphrase.
                <em> Please write this down and store it in a safe place!</em>
              </p>
            </div>
            <div className='create-passphrase-form-items'>
              <FloatingInput
                placeholder='Passphrase'
                toggleablePassword
                onInput={(e) => onFormInputChange({ passphrase: e.currentTarget.value })}
                className='create-passphrase-input'
              />
              <FloatingInput
                placeholder='Confirm Passphrase'
                toggleablePassword
                onInput={(e) => onFormInputChange({ confirmPassphrase: e.currentTarget.value })}
                className='create-passphrase-input'
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
            </div>
          </div>
        </BodyView>
        <FooterView>
          <Button
            type='submit'
            disabled={!isLong || !isUnique || !isMatching}
          >
            Create Passphrase
          </Button>
        </FooterView>
    </FormLayout>
  )
}

CreatePassphraseForm.displayName = 'CreatePassphraseForm'

export default CreatePassphraseForm
