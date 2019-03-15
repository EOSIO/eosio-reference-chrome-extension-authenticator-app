import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'

import AccordionTab from './AccordionTab'
import AccordionTabHeader from './AccordionTabHeader'

describe('AccordionTab', () => {
  let accordionTab: ShallowWrapper
  let tabId: string
  let ricardianContract: any
  let action: any
  let toggleChecked: (actionId: string) => void
  let toggleOpen: (actionId: string) => void

  beforeEach(() => {
    tabId = 'accordion-test'
    action = {
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
    ricardianContract = {
      getHtml: jest.fn().mockReturnValue('HTML'),
      getMetadata: jest.fn().mockReturnValue({
        title: 'Title',
        summary: 'Summary',
        icon: 'Icon',
      }),
    }
    toggleChecked = jest.fn()
    toggleOpen = jest.fn()
  })

  it('renders a header with the correct props', () => {
    accordionTab = shallow(
      <AccordionTab
        id={tabId}
        ricardianContract={ricardianContract}
        action={action}
        isOpen
        toggleOpen={toggleOpen}
        isChecked={false}
        toggleChecked={toggleChecked}
      >
        <div className='test' />
      </AccordionTab>,
    )

    expect(accordionTab.find(AccordionTabHeader).props()).toEqual({
      id: tabId,
      ricardianContract,
      action,
      isOpen: true,
      toggleOpen,
      isChecked: false,
      toggleChecked,
    })
  })

  describe('rendering with tab open', () => {
    beforeEach(() => {
      accordionTab = shallow(
        <AccordionTab
          id={tabId}
          ricardianContract={ricardianContract}
          action={action}
          isOpen
          toggleOpen={toggleOpen}
          isChecked={false}
          toggleChecked={toggleChecked}
        >
          <div className='test' />
        </AccordionTab>,
      )
    })

    it('renders the children (test div)', () => {
      expect(accordionTab.find('.test')).toHaveLength(1)
    })
  })

  describe('rendering without tab open', () => {
    beforeEach(() => {
      accordionTab = shallow(
        <AccordionTab
          id={tabId}
          ricardianContract={ricardianContract}
          action={action}
          isOpen={false}
          toggleOpen={toggleOpen}
          isChecked={false}
          toggleChecked={toggleChecked}
        >
          <div className='test' />
        </AccordionTab>,
      )
    })

    it('does not render the children (test div)', () => {
      expect(accordionTab.find('.test')).toHaveLength(0)
    })
  })
})
