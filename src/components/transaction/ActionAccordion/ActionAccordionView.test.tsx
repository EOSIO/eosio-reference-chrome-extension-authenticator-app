import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import * as CTT from 'ricardian-template-toolkit'

import ActionAccordionView from './ActionAccordionView'
import AccordionTab from 'components/transaction/ActionAccordion/AccordionTab/AccordionTab'
import Contract from 'components/transaction/ActionAccordion/Contract/Contract'
import generateActionID from 'utils/generateActionID'

describe('ActionAccordionView', () => {
  let actionAccordion: ShallowWrapper
  let onTransactionError: jest.Mock
  let onSetCanAccept: jest.Mock
  let actionTransfer: any
  let actionTransferTwo: any
  let transactionInfo: any
  let actionId: string
  let actionIdTwo: string
  let actions: any[]
  let abis: any[]
  let ricardianContract: any
  let ricardianContractFactory: any
  let ricardianContractHTML: string

  beforeEach(() => {
    onTransactionError = jest.fn()
    onSetCanAccept = jest.fn()

    ricardianContractHTML = '<span>Here is a contract</span>'
    ricardianContract = {
      getHtml: jest.fn().mockReturnValue(ricardianContractHTML)
    }
    ricardianContractFactory = {
      create: jest.fn().mockReturnValue(ricardianContract)
    }
    jest.spyOn(CTT, 'RicardianContractFactory').mockImplementation(() => (ricardianContractFactory))

    actionTransfer = {
      account: 'testeostoken',
      name: 'transfer',
      authorization: [
        {
          actor: 'thegazelle',
          permission: 'active',
        },
      ],
      data: {
        from: 'thegazelle',
        to: 'remasteryoda',
        quantity: '1.0000 EOS',
        memo: 'For the future of chains around the world',
      },
    }
    actionId = generateActionID(actionTransfer)

    actionTransferTwo = {
      account: 'testeostoken',
      name: 'transfer',
      authorization: [
        {
          actor: 'thegazelle',
          permission: 'active',
        },
      ],
      data: {
        from: 'thegazelle',
        to: 'remasteryoda',
        quantity: '2.0000 EOS',
        memo: 'For the future of chains around the world',
      },
    }
    actionIdTwo = generateActionID(actionTransferTwo)

    actions = [actionTransfer, actionTransferTwo]

    transactionInfo = {
      actions,
    }

    abis = [{
      abi: {
        actions: [{
          name: 'transfer',
        },
        {
          name: 'issue',
          ricardian_contract: '',
        }],
      },
      accountName: 'testeostoken',
    }]
  })

  describe('rendering', () => {
    beforeEach(() => {
      actionAccordion = shallow(
        <ActionAccordionView
          transactionInfo={transactionInfo}
          abis={abis}
          onSetCanAccept={onSetCanAccept}
          onTransactionError={onTransactionError}
          allowUnusedContractVariables={false}
          canOpenMultiple
        />,
      )
    })

    it('renders the AccordionTab component for each action in the array', () => {
      expect(actionAccordion.find(AccordionTab)).toHaveLength(2)
    })

    it('renders the Contract component for each action in the array', () => {
      expect(actionAccordion.find(Contract)).toHaveLength(2)
    })

    it('passes the transaction to the Contract component', () => {
      expect(actionAccordion.find(Contract).first().prop('ricardianContractHTML')).toEqual(ricardianContractHTML)
    })

    describe('when the first closed tab is toggled to open', () => {
      beforeEach(() => {
        actionAccordion.find(AccordionTab).first().prop('toggleOpen')(actionId)
      })

      it('adds to the openTabs array', () => {
        const openTabs: string[] = actionAccordion.state('openTabs')

        expect(openTabs.includes(actionId)).toBe(true)
      })

      describe('when the final tab is toggled to open with canOpenMultiple set to true', () => {
        beforeEach(() => {
          actionAccordion.find(AccordionTab).at(1).prop('toggleOpen')(actionIdTwo)
        })

        it('adds the second item to the array and keeps the first open', () => {
          const openTabs: string[] = actionAccordion.state('openTabs')

          expect(openTabs.includes(actionIdTwo)).toBe(true)
          expect(openTabs.includes(actionId)).toBe(true)
        })

        describe('when the second open tab is toggled to close', () => {
          beforeEach(() => {
            actionAccordion.find(AccordionTab).at(1).prop('toggleOpen')(actionIdTwo)
          })

          it('removes the second actionId from the array and keeps the first open', () => {
            const openTabs: string[] = actionAccordion.state('openTabs')

            expect(openTabs.includes(actionIdTwo)).toBe(false)
            expect(openTabs.includes(actionId)).toBe(true)
          })
        })
      })
    })

    describe('when the first tab is checked', () => {
      beforeEach(() => {
        actionAccordion.find(AccordionTab).first().prop('toggleChecked')(actionId)
      })

      it('adds to the checkedTabs array', () => {
        const checkedTabs: string[] = actionAccordion.state('checkedTabs')

        expect(checkedTabs.includes(actionId)).toBe(true)
      })

      describe('when the final tab is checked', () => {
        beforeEach(() => {
          actionAccordion.find(AccordionTab).at(1).prop('toggleChecked')(actionIdTwo)
        })

        it('adds the second actionId to the array and keeps the first', () => {
          const checkedTabs: string[] = actionAccordion.state('checkedTabs')

          expect(checkedTabs.includes(actionIdTwo)).toBe(true)
          expect(checkedTabs.includes(actionId)).toBe(true)
        })

        it('calls the toggleCanAccept prop function', () => {
          expect(onSetCanAccept).toHaveBeenCalled()
        })

        describe('when the final tab is unchecked', () => {
          beforeEach(() => {
            actionAccordion.find(AccordionTab).at(1).prop('toggleChecked')(actionIdTwo)
          })

          it('removes the second actionId from the array and keeps the first', () => {
            const checkedTabs: string[] = actionAccordion.state('checkedTabs')

            expect(checkedTabs.includes(actionIdTwo)).toBe(false)
            expect(checkedTabs.includes(actionId)).toBe(true)
          })

          describe('when the first tab is unchecked', () => {
            beforeEach(() => {
              actionAccordion.find(AccordionTab).first().prop('toggleChecked')(actionId)
            })

            it('removes it from the checkedTabs array', () => {
              const checkedTabs: string[] = actionAccordion.state('checkedTabs')

              expect(checkedTabs.includes(actionId)).toBe(false)
            })
          })
        })
      })
    })

    describe('toggling both tabs open with canOpenMultiple false', () => {
      beforeEach(() => {
        actionAccordion = shallow(
        <ActionAccordionView
          transactionInfo={transactionInfo}
          abis={abis}
          onSetCanAccept={onSetCanAccept}
          onTransactionError={onTransactionError}
          allowUnusedContractVariables={false}
          canOpenMultiple={false}
        />)
        actionAccordion.find(AccordionTab).first().prop('toggleOpen')(actionId)
        actionAccordion.find(AccordionTab).first().prop('toggleOpen')(actionIdTwo)
      })

      it('only keeps the second tab open', () => {
        const openTabs: string[] = actionAccordion.state('openTabs')

        expect(openTabs.includes(actionIdTwo)).toBe(true)
        expect(openTabs.includes(actionId)).toBe(false)
      })
    })
  })

  describe('rendering action with missing ABI', () => {
    let actionCreate

    beforeEach(() => {
      actionCreate = {
        account: 'testeostoken2',
        name: 'create',
        authorization: [
          {
            actor: 'thegazelle',
            permission: 'active',
          },
        ],
        data: {
          memo: 'To create anew',
        },
      }
      transactionInfo.actions = [actionCreate]
      actionAccordion = shallow(
      <ActionAccordionView
        transactionInfo={transactionInfo}
        abis={abis}
        onSetCanAccept={onSetCanAccept}
        onTransactionError={onTransactionError}
        allowUnusedContractVariables={false}
        canOpenMultiple
      />)
    })

    it('sends an error message back to the dapp', () => {
      expect(onTransactionError).toHaveBeenCalledWith(
        'Error Rendering Transaction: ABI for create action under testeostoken2 was not provided',
      )
    })
  })

  describe('rendering action with ABI missing the action', () => {
    let actionCreate

    beforeEach(() => {
      actionCreate = {
        account: 'testeostoken',
        name: 'create',
        authorization: [
          {
            actor: 'thegazelle',
            permission: 'active',
          },
        ],
        data: {
          memo: 'To create anew',
        },
      }
      transactionInfo.actions = [actionCreate]
      actionAccordion = shallow(
      <ActionAccordionView
        transactionInfo={transactionInfo}
        abis={abis}
        onSetCanAccept={onSetCanAccept}
        onTransactionError={onTransactionError}
        allowUnusedContractVariables={false}
        canOpenMultiple
      />)
    })

    it('sends an error message back to the dapp', () => {
      expect(onTransactionError).toHaveBeenCalledWith(
        'Error Rendering Transaction: ABI under testeostoken does not contain action create',
      )
    })
  })

  describe('when CTT throws an error', () => {
    const errorMessage = 'cannot generate ricardian'
    let failingContractFactory: any

    beforeEach(() => {
      failingContractFactory = {
        create: jest.fn().mockImplementation(() => {
          throw new Error(errorMessage)
        })
      }
      jest.spyOn(CTT, 'RicardianContractFactory').mockImplementation(() => (failingContractFactory))
      actionAccordion = shallow(
        <ActionAccordionView
          transactionInfo={transactionInfo}
          abis={abis}
          onSetCanAccept={onSetCanAccept}
          onTransactionError={onTransactionError}
          allowUnusedContractVariables={false}
          canOpenMultiple
        />)
    })

    it('sends an error message back to the dapp', () => {
      expect(onTransactionError).toHaveBeenCalledWith(
        `Ricardian Contract Error - ${errorMessage}`,
      )
    })
  })
})
