import * as React from 'react'
import { RicardianContractFactory } from 'ricardian-template-toolkit'

import './ActionAccordionView.css'

import { TransactionInfo, Action } from 'eos/Transaction'
import AccordionTab from 'components/transaction/ActionAccordion/AccordionTab/AccordionTab'
import Contract from 'components/transaction/ActionAccordion/Contract/Contract'
import generateActionID from 'utils/generateActionID'

interface Props {
  transactionInfo: TransactionInfo
  abis: any[]
  allowUnusedContractVariables: boolean
  canOpenMultiple?: boolean
  onTransactionError: (error: string) => void
  onSetCanAccept: (value: boolean) => void
}

interface State {
  openTabs: string[]
  checkedTabs: string[]
}

class ActionAccordionView extends React.Component<Props, State> {
  public static displayName = 'ActionAccordion'

  public static defaultProps: Partial<Props> = {
    canOpenMultiple: true,
  }

  public state: State = {
    openTabs: [],
    checkedTabs: [],
  }

  public render() {
    return (
      <div className='accordion'>
        {this.mapActionsToTabs()}
      </div>
    )
  }

  private mapActionsToTabs = () => {
    const { transactionInfo, abis, onTransactionError, allowUnusedContractVariables } = this.props

    return transactionInfo.actions.map((action: Action, index: number) => {
      const matchedABIObject = abis.find((abiObject) => abiObject.accountName === action.account)

      if (!matchedABIObject) {
        return onTransactionError(
          `Error Rendering Transaction: ABI for ${action.name} action under ${action.account} was not provided`,
        )
      }

      const abi = matchedABIObject.abi
      const actionFoundInABI = abi.actions.findIndex((abiAction: any) => abiAction.name === action.name) > -1

      if (!actionFoundInABI) {
        return onTransactionError(
          `Error Rendering Transaction: ABI under ${action.account} does not contain action ${action.name}`,
        )
      }

      let ricardianContractFactory
      let ricardianContract
      try {
        ricardianContractFactory = new RicardianContractFactory()
        ricardianContract = ricardianContractFactory.create({
          transaction: transactionInfo,
          abi,
          actionIndex: index,
          allowUnusedVariables: allowUnusedContractVariables,
        })
      } catch (error) {
        return onTransactionError(
          `Ricardian Contract Error - ${error.message}`,
        )
      }
      const actionId = generateActionID(action)

      return (
        <AccordionTab
          ricardianContract={ricardianContract}
          action={action}
          isOpen={this.isTabOpen(actionId)}
          toggleOpen={this.toggleOpen}
          disableToggle={this.disableToggle}
          isChecked={this.isTabChecked(actionId)}
          toggleChecked={this.toggleChecked}
          id={actionId}
          key={actionId}
        >
          <Contract ricardianContractHTML={ricardianContract.getHtml()} />
        </AccordionTab>
      )
    })
  }

  private toggleOpen = (id: string) => {
    const { canOpenMultiple } = this.props
    const { openTabs } = this.state

    const index = openTabs.indexOf(id)
    if (canOpenMultiple && index === -1) {
      this.setState((prevState) => ({
        openTabs: [...prevState.openTabs, id],
      }))
    } else if (index === -1) {
      this.setState({
        openTabs: [id],
      })
    } else {
      this.setState((prevState) => ({
        openTabs: prevState.openTabs.slice(0, index).concat(prevState.openTabs.slice(index + 1)),
      }))
    }
  }

  private toggleChecked = (id: string) => {
    const { transactionInfo, onSetCanAccept } = this.props
    const { checkedTabs } = this.state
    const actions = transactionInfo.actions

    const index = checkedTabs.indexOf(id)
    if (index === -1) { // add to checked array and potentially enable accepting on TransactionScreen
      if (actions.length === checkedTabs.length + 1) { // check first to avoid waiting for setState to complete
        onSetCanAccept(true)
      }
      this.setState((prevState) => ({
        checkedTabs: [...prevState.checkedTabs, id],
      }))
    } else { // remove from checked array and potentially disable accepting on TransactionScreen
      if (actions.length === checkedTabs.length) {
        onSetCanAccept(false)
      }
      this.setState((prevState) => ({
        checkedTabs: prevState.checkedTabs.slice(0, index).concat(prevState.checkedTabs.slice(index + 1)),
      }))
    }
  }

  private get disableToggle() {
    return this.props.transactionInfo.actions.length <= 1
  }

  private isTabOpen(actionId: string) {
    return this.state.openTabs.indexOf(actionId) !== -1 || this.disableToggle
  }

  private isTabChecked(actionId: string) {
    return this.state.checkedTabs.indexOf(actionId) !== -1 || this.disableToggle
  }
}

export default ActionAccordionView
