import * as React from 'react'
import { debounce } from 'lodash'
import './AuthDetailsForm.css'

import FloatingInput from 'components/shared/input/FloatingInput'
import TransitionButton from 'components/shared/transitionButton/TransitionButton'
import Auth from 'utils/Auth'
import ellipsisIcon from 'assets/images/loading-ellipsis.svg'
import { DEBOUNCE_DELAY } from 'constants/windowManager'

type statusString = 'showing' | 'hide' | 'editing'

export const NICKNAME_ERRORS = {
  INVALID_NICKNAME: 'Invalid nickname',
  DUPLICATE_NICKNAME: 'Nickname already exists',
}

interface Props {
  auths: Auth[]
  currentAuth: Auth,
  onAuthUpdate: (currentNickname: string, newNickname: string) => void,
}

interface State {
  nickname: string
  publicKey: string
  savedStatus: statusString
  copyError: string
  isCopying: boolean
  nicknameError: string
}

export default class AuthDetailsForm extends React.Component<Props, State> {
  public static displayName = 'AuthDetailsForm'

  public state: State = {
    nickname: this.props.currentAuth.nickname,
    publicKey: this.props.currentAuth.publicKey,
    savedStatus: 'hide',
    copyError: null,
    isCopying: false,
    nicknameError: '',
  }

  private transitionButtonRef: React.RefObject<TransitionButton>

  constructor(props: Props) {
    super(props)
    this.transitionButtonRef = React.createRef()
  }

  private debouncedSubmit = debounce(() => {
    const newNickname = this.state.nickname.trim()
    if (this.state.nicknameError) {
      return
    }
    this.props.onAuthUpdate(this.props.currentAuth.nickname, newNickname)
    this.setState({ savedStatus: 'showing' })
    setTimeout(() => this.setState({ savedStatus: 'hide' }), DEBOUNCE_DELAY + 350)
  }, DEBOUNCE_DELAY)

  public render() {
    return (
      <form className='edit-auth-form'>
        <div className='nickname-input-container'>
          <FloatingInput
            placeholder='Nickname'
            onInput={(e: React.FormEvent<HTMLInputElement>) => this.handleUpdateNickname(e.currentTarget.value)}
            value={this.state.nickname}
            error={this.state.nicknameError}
          />
          <div className={'nickname-saved-' + this.state.savedStatus}>Saved</div>
          {this.state.savedStatus === 'editing' && <img className='editing-ellipsis' src={ellipsisIcon} alt='...' />}
        </div>
        <div className='public-key-container'>
          <FloatingInput
            placeholder='Public Key'
            value={this.state.publicKey}
            error={this.state.copyError}
            id='publicKeyInput'
            disabled
          />
          <TransitionButton
            ref={this.transitionButtonRef}
            text={'Copy'}
            successText={'Copied!'}
            type='button'
            onClick={this.copyPublicKeyToClipboard}
          />
        </div>
      </form>
    )
  }

  private handleUpdateNickname = (newNickname: string) => {
    const nicknameError = this.generateNicknameError(newNickname.trim())

    if (nicknameError) {
      this.setState({
        savedStatus: 'hide',
        nickname: newNickname,
        nicknameError,
      })
    } else {
      this.setState({
        savedStatus: 'editing',
        nickname: newNickname,
        nicknameError: '',
      })
      this.debouncedSubmit()
    }
  }

  private copyPublicKeyToClipboard = () => {
    if (this.state.isCopying) { return }

    const publicKeyEl = document.getElementById('publicKeyInput') as HTMLInputElement
    publicKeyEl.removeAttribute('disabled')
    publicKeyEl.select()

    if (!document.execCommand('copy')) {
      this.setState({ copyError: 'Error while copying to clipboard' })
    } else {
      window.getSelection().empty()
      publicKeyEl.blur()
      publicKeyEl.setAttribute('disabled', 'true')
      this.setState({ copyError: null, isCopying: true })
      this.transitionButtonRef.current.animateSuccess(false, () => {
        this.setState({ isCopying: false })
      })
    }
  }

  private generateNicknameError = (newNickname: string) => {
    if (!newNickname) {
      return NICKNAME_ERRORS.INVALID_NICKNAME
    } else if (this.props.auths.find((auth) => auth.nickname === newNickname)) {
      return NICKNAME_ERRORS.DUPLICATE_NICKNAME
    }

    return ''
  }
}
