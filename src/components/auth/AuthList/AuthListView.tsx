import * as React from 'react'
import './AuthListView.css'

import NavBar, { settingsButton } from 'components/navigation/NavBar'
import Button from 'components/shared/button/Button'
import PageLayout from 'components/shared/layout/PageLayout'
import BodyView from 'components/shared/layout/BodyView'
import AuthItemView from 'components/auth/AuthList/AuthItemView'
import AuthItemRemovedView from 'components/auth/AuthList/AuthItemRemovedView'
import FooterView from 'components/shared/layout/FooterView'
import Auth from 'utils/Auth'
import noAuthsIcon from 'assets/images/no-auths-icon.svg'
import addAuthPlus from 'assets/images/add-auth-plus.svg'
import { DelayedRemovable } from 'store/AppState'

interface Props {
  loading: boolean
  auths: Auth[]
  onAddAuth: () => void
  onAuthRemoveUndo: (publicKey: string) => void
}

const AuthListView: React.SFC<Props> = ({ auths, onAddAuth, onAuthRemoveUndo }) => {
  const renderAuthList = () => (
    auths.length
    ? auths.map((auth: DelayedRemovable<Auth>) => {
      if (auth.removing) {
        return <AuthItemRemovedView key={auth.publicKey} auth={auth} onAuthRemoveUndo={onAuthRemoveUndo} />
      }

      return <AuthItemView key={auth.publicKey} auth={auth} />
    })
    : renderNoAuths()
  )

  const renderNoAuths = () => (
    <div className='no-auths-container'>
      <img className='no-auths-icon' src={noAuthsIcon} alt='sad key face' />
      <h1 className='no-auths-title'>No Auths Yet!</h1>
      <span className='no-auths-text'>To get started, add an Auth using the button below.</span>
    </div>
  )

  return (
    <PageLayout>
      <NavBar
        rightButton={settingsButton}
        renderLogo
      />

      <BodyView>
        <div className='auth-list-container'>
          {renderAuthList()}
        </div>
      </BodyView>

      <FooterView>
        <Button
          type='button'
          secondaryStyle
          borderedStyle
          onClick={onAddAuth}
        >
          <img src={addAuthPlus} />
          Add Additional Auth
        </Button>
      </FooterView>
    </PageLayout>
  )
}

AuthListView.displayName = 'AuthListView'
export default AuthListView
