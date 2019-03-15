import * as React from 'react'
import './AuthDetailsView.css'

import AuthDetailsForm from 'components/auth/AuthDetailsForm/AuthDetailsForm'
import PageLayout from 'components/shared/layout/PageLayout'
import NavBar from 'components/navigation/NavBar'
import BodyView from 'components/shared/layout/BodyView'
import Button from 'components/shared/button/Button'
import Auth from 'utils/Auth'

interface Props {
  auth: Auth,
  auths: Auth[],
  onAuthRemove: (name: string) => void,
  onAuthUpdate: (currentNickname: string, newNickname: string) => void
}

const AuthDetailsView: React.SFC<Props> = ({ auth, auths, onAuthRemove, onAuthUpdate }) => (
  <PageLayout>
    <NavBar />
    <BodyView>
      <div className='auth-details'>
        <h1 className='auth-details-title'>Auth Details</h1>
        <AuthDetailsForm currentAuth={auth} auths={auths} onAuthUpdate={onAuthUpdate} />
        <Button
          type='button'
          secondaryStyle
          borderedStyle
          onClick={() => onAuthRemove(auth.nickname)}
          id='deleteAuth'
        >
          Delete this Auth
        </Button>
      </div>
    </BodyView>
  </PageLayout>
)

AuthDetailsView.displayName = 'AuthDetailsView'
export default AuthDetailsView
