import * as data from '__mocks__/data.mock'
import * as apiMocks from 'utils/__mocks__/Api.mock'
import * as securityExclusionMocks from 'utils/manifest/__mocks__/SecurityExclusion.mock'

import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { SecurityExclusions } from 'eosjs-signature-provider-interface'

import { ActionAccordionContainer, mapStateToProps } from './ActionAccordionContainer'
import ActionAccordionView from './ActionAccordionView'
import DappRequest from 'utils/requests/DappRequest'
import { clone } from 'utils/helpers'
import { InsecureMode } from 'utils/insecureMode/InsecureMode'

describe('ActionAccordionContainer', () => {
  let actionAccordionContainer: ShallowWrapper
  let request: DappRequest
  let insecureMode: InsecureMode
  let rootUrl: string
  let abis: any
  let onSetCanAccept: jest.Mock
  let onTransactionError: jest.Mock

  beforeEach(() => {
    request = {
      transactionInfo: clone(data.transactionWithSingleAction),
      requestEnvelope: clone(data.transactionSignatureRequest),
    }

    insecureMode = {
      enabled: true,
      whitelist: ['http://domain.one']
    }

    rootUrl = 'http://domain.one'

    abis = [
      'abi1',
      'abi2',
    ]

    onSetCanAccept = jest.fn()
    onTransactionError = jest.fn()

    apiMocks.decodeAbis.mockImplementation((abisParam: any) => {
      if (abisParam === request.requestEnvelope.request.transactionSignature.abis) {
        return abis
      }
      return undefined
    })

    securityExclusionMocks.shouldValidate.mockImplementation((
      securityMeasureParam: string,
      securityExclusionsParam: SecurityExclusions,
      insecureModeParam: InsecureMode,
      rootUrlParam: string,
    ) => {
      return securityMeasureParam === 'relaxedContractParsing'
        && securityExclusionsParam === request.requestEnvelope.securityExclusions
        && insecureModeParam === insecureMode
        && rootUrlParam === rootUrl
    })
  })

  describe('when rendered', () => {
    beforeEach(() => {
      shallowRenderActionAccordionContainer()
    })

    it('renders the action accordion view', () => {
      expect(actionAccordionContainer.find(ActionAccordionView).props()).toEqual({
        transactionInfo: request.transactionInfo,
        abis,
        allowUnusedContractVariables: false,
        onSetCanAccept,
        onTransactionError,
        canOpenMultiple: true,
      })
    })

    it('gets data from the redux state', () => {
      const state = {
        request: {
          data: request,
        },
        dappInfo: {
          data: {
            rootUrl,
          }
        },
        insecureMode: {
          data: insecureMode,
        },
      }

      expect(mapStateToProps(state as any).requestEnvelope).toEqual(request.requestEnvelope)
      expect(mapStateToProps(state as any).transactionInfo).toEqual(request.transactionInfo)
      expect(mapStateToProps(state as any).rootUrl).toEqual(rootUrl)
      expect(mapStateToProps(state as any).insecureMode).toEqual(insecureMode)
    })
  })

  const shallowRenderActionAccordionContainer = () => {
    actionAccordionContainer = shallow(
      <ActionAccordionContainer
        requestEnvelope={request.requestEnvelope}
        transactionInfo={request.transactionInfo}
        rootUrl={rootUrl}
        insecureMode={insecureMode}
        onTransactionError={onTransactionError}
        onSetCanAccept={onSetCanAccept}
      />
    , {
      disableLifecycleMethods: true,
    })
  }
})
