import '__mocks__/chrome.mock'

import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'

import {
  WhitelistContainer,
  mapStateToProps,
  mapDispatchToProps } from 'components/insecureMode/whitelist/WhitelistContainer'
import WhitelistForm from 'components/insecureMode/whitelist/WhitelistForm'
import * as insecureModeActions from 'store/insecureMode/insecureModeActions'

describe('WhitelistContainer', () => {
  let whitelistContainer: ShallowWrapper
  const dispatch = jest.fn()
  const onWhitelistAdd = jest.fn()
  const onWhitelistDelete = jest.fn()
  const event = {
    target: {
      value: 'url1',
    },
  }

  beforeEach(() => {
    whitelistContainer = shallow(
      <WhitelistContainer
        urls={['url1', 'url2']}
        error={new Error('error1')}
        onWhitelistAdd={onWhitelistAdd}
        onWhitelistDelete={onWhitelistDelete}
      />,
    )
  })

  describe('when rendered', () => {
    it('should render the WhitelistForm with the urlList', () => {
      expect(whitelistContainer.find(WhitelistForm).prop('urlList')).toEqual([
        'url1',
        'url2',
      ])
    })

    it('gets urls from the redux state', () => {
      const state = {
        insecureMode: {
          data: {
            whitelist: ['url3', 'url4'],
          },
        },
      }

      expect(mapStateToProps(state as any).urls).toEqual(['url3', 'url4'])
    })

    it('should pass the Error to the WhitelistForm', () => {
      expect(whitelistContainer.find(WhitelistForm).prop('error')).toEqual(new Error('error1'))
    })

    it('gets errors from the redux state', () => {
      const state = {
        insecureMode: {
          data: {
            whitelist: ['url3', 'url4'],
          },
          error: new Error('error2'),
        },
      }

      expect(mapStateToProps(state as any).error ).toEqual(new Error('error2'))
    })

    it('maps onWhiteListAdd to insecureModeWhitelist add action', async () => {
      const { onWhitelistAdd: dispatchWhitelistAddAction} = mapDispatchToProps(dispatch)

      jest.spyOn(insecureModeActions, 'insecureModeWhitelistAdd').mockReturnValue('whitelist add action')

      dispatchWhitelistAddAction('url3')
      expect(dispatch).toHaveBeenCalledWith('whitelist add action')
    })

    describe('and input value is changed within form', () => {
      it('changes urlInput state accordingly', () => {
        whitelistContainer.find(WhitelistForm).prop('onInput')(event as React.ChangeEvent<HTMLInputElement>)
        expect(whitelistContainer.state('urlInput')).toEqual('url1')
      })
    })

    describe('and onWhitelistAdd is called from the form', () => {
      beforeEach(async () => {
        whitelistContainer.setState({ urlInput: 'url' })
        await whitelistContainer.find(WhitelistForm).prop('onWhitelistAdd')('url')
      })

      it('the url is passed correctly', () => {
        expect(onWhitelistAdd).toHaveBeenCalledWith('url')
      })

      it('does not clear the urlInput if there is an error', () => {
        expect(whitelistContainer.state('urlInput')).toBe('url')
      })

      it('clears the urlInput if there is not an error', async () => {
        whitelistContainer.setProps({ error: null })
        await whitelistContainer.find(WhitelistForm).prop('onWhitelistAdd')('url')
        expect(whitelistContainer.state('urlInput')).toBe('')
      })
    })

    it('maps onWhitelistDelete to insecureModeWhitelist delete action', async () => {
      const { onWhitelistDelete: dispatchWhitelistDeleteAction } = mapDispatchToProps(dispatch)

      jest.spyOn(insecureModeActions, 'insecureModeWhitelistDelete').mockReturnValue('whitelist delete action')

      dispatchWhitelistDeleteAction('url1')
      expect(dispatch).toHaveBeenCalledWith('whitelist delete action')
    })

    it('onWhitelistDelete called when a url is deleted', () => {
      whitelistContainer.find(WhitelistForm).prop('onWhitelistDelete')('url')
      expect(onWhitelistDelete).toHaveBeenCalledWith('url')
    })
  })
})
