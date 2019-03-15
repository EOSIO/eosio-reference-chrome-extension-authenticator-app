import { connect } from 'react-redux'

import * as React from 'react'
import WhitelistForm from 'components/insecureMode/whitelist/WhitelistForm'
import AppState from 'store/AppState'
import { Dispatch } from 'store/storeHelpers'
import { insecureModeWhitelistAdd, insecureModeWhitelistDelete } from 'store/insecureMode/insecureModeActions'

interface Props {
  urls: string[],
  error?: Error,
  onWhitelistAdd: (url: string) => void,
  onWhitelistDelete: (url: string) => void,
}

interface State {
  urlInput: string
}

export class WhitelistContainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      urlInput: '',
    }
  }

  public render() {
    return (
      <WhitelistForm
        urlList={this.props.urls}
        urlInput={this.state.urlInput}
        onInput={this.onInput}
        error={this.props.error}
        onWhitelistAdd={this.attemptWhitelistAdd}
        onWhitelistDelete={this.props.onWhitelistDelete}
      />
    )
  }

  private attemptWhitelistAdd = async (urlInput: string) => {
    await this.props.onWhitelistAdd(urlInput)
    if (!this.props.error) {
      this.setState({ urlInput: ''})
    }
  }

  private onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ urlInput: e.target.value })
  }
}

export const mapStateToProps = (state: AppState) => ({
  urls:  state.insecureMode.data.whitelist,
  error: state.insecureMode.error,
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  onWhitelistAdd: async (url: string) => {
    await dispatch(insecureModeWhitelistAdd(url))
  },
  onWhitelistDelete: (url: string) => {
    dispatch(insecureModeWhitelistDelete(url))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(WhitelistContainer)
