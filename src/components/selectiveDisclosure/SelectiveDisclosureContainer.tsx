import * as React from 'react'
import { connect } from 'react-redux'
import {
  Authorizer,
  ErrorCodes,
  SignatureProviderRequestEnvelope,
} from 'eosjs-signature-provider-interface'

import SelectiveDisclosureView from 'components/selectiveDisclosure/SelectiveDisclosureView'
import AppState from 'store/AppState'
import Auth from 'utils/Auth'
import { DappInfo } from 'utils/manifest/DappInfo'
import getDefaultDappMessenger, { DappMessenger } from 'utils/requests/DappMessenger'
import getDefaultWindowManager, { WindowManager } from 'utils/WindowManager'
import {
  createErrorResponseEnvelope,
  createSelectiveDisclosureResponseEnvelope,
} from 'utils/requests/signatureProviderEnvelopeGenerators'

interface Props {
  requestEnvelope: SignatureProviderRequestEnvelope
  dappInfo: DappInfo
  auths: Auth[]
}

export class SelectiveDisclosureContainer extends React.Component<Props> {
  public static displayName = 'SelectiveDisclosureContainer'

  private dappMessenger: DappMessenger
  private windowManager: WindowManager

  constructor(props: Props) {
    super(props)
    this.dappMessenger = getDefaultDappMessenger()
    this.windowManager = getDefaultWindowManager()
  }

  public render() {
    const { name, icon } = this.props.dappInfo.appMetadataInfo.appMetadata
    const { declaredDomain } = this.props.requestEnvelope
    return (
      <SelectiveDisclosureView
        dappName={name}
        dappIcon={icon}
        dappDeclaredDomain={declaredDomain}
        onDeny={this.onDeny}
        onAccept={this.onAccept}
      />
    )
  }

  private onAccept = () => {
    const { requestEnvelope: { id }, auths } = this.props

    const keys: Authorizer[] = auths.map((auth: Auth) => ({
      publicKey: auth.publicKey,
    }))
    const responseEnvelope = createSelectiveDisclosureResponseEnvelope(id, keys)

    this.dappMessenger.sendMessage(responseEnvelope)
    this.windowManager.closeCurrentWindow()
  }

  private onDeny = () => {
    const { requestEnvelope } = this.props

    const responseEnvelope = createErrorResponseEnvelope(requestEnvelope, {
      reason: 'The request was denied by the specified authority',
      errorCode: ErrorCodes.unexpectedError, // TODO: need error for rejecting request
      contextualInfo: '',
    })

    this.dappMessenger.sendMessage(responseEnvelope)
    this.windowManager.closeCurrentWindow()
  }
}

export const mapStateToProps = (state: AppState) => ({
  auths: state.auths.data,
  dappInfo: state.dappInfo.data,
  requestEnvelope: state.request.data.requestEnvelope,
})

export default connect(mapStateToProps)(SelectiveDisclosureContainer)
