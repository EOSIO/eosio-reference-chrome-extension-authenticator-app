import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'

import WhitelistForm from 'components/insecureMode/whitelist/WhitelistForm'
import FloatingInput from 'components/shared/input/FloatingInput'

describe('WhiteListForm', () => {
  let whitelistForm: ShallowWrapper
  let onInput: jest.Mock
  let onWhitelistAdd: jest.Mock
  let onWhitelistDelete: jest.Mock
  const urlList = ['url1', 'url2']
  const event = {
    target: {
      value: 'url1',
    },
  }
  const submitEvent = {
    preventDefault: jest.fn(),
  }

  beforeEach(() => {
    onInput = jest.fn()
    onWhitelistAdd = jest.fn()
    onWhitelistDelete = jest.fn()

    whitelistForm = shallow(
      <WhitelistForm
        urlList={urlList}
        urlInput=''
        onInput={onInput}
        error={new Error('error1')}
        onWhitelistAdd={onWhitelistAdd}
        onWhitelistDelete={onWhitelistDelete}
      />,
    )
  })

  describe('when rendered', () => {
    it('should render save button', () => {
      expect(whitelistForm.find('.whitelist-add-btn').text()).toBe('Save')
    })

    it('should render the shared floating input', () => {
      expect(whitelistForm.find(FloatingInput)).toHaveLength(1)
    })

    it('should render list of urls', () => {
      urlList.forEach((url: string, index: number) => {
        expect(whitelistForm.find('.url').at(index).text()).toBe(url)
      })
    })

    it('should render a delete button for each url', () => {
      urlList.forEach((url: string, index: number) => {
        expect(whitelistForm.find('.whitelist-delete-btn').at(index).prop('name')).toBe(url)
      })
    })

    it('should not render url list if it\'s empty', () => {
      whitelistForm = shallow(
        <WhitelistForm
          urlList={undefined}
          urlInput=''
          onInput={onInput}
          onWhitelistAdd={onWhitelistAdd}
          onWhitelistDelete={onWhitelistDelete}
        />,
      )
      expect(whitelistForm.find('.url-list').children().length).toBe(0)
    })
  })

  describe('when a url is entered in the form', () => {
    it('should call the onInput prop', () => {
      whitelistForm.find(FloatingInput).prop('onInput')(event as React.ChangeEvent<HTMLInputElement>)
      expect(onInput).toHaveBeenCalledWith(event)
    })
  })

  describe('when the urlInput is changed', () => {
    it('should update the input value with the url', () => {
      whitelistForm.setProps({ urlInput: 'url1' })
      expect(whitelistForm.find(FloatingInput).prop('value')).toBe('url1')
    })
  })

  describe('when the form is submitted', () => {
    beforeEach(async () => {
      whitelistForm.setProps({ urlInput: 'url1' })
      await whitelistForm.find('form').prop('onSubmit')(submitEvent as any)
    })

    it('should call the onWhiteListAdd prop with the url', () => {
      expect(onWhitelistAdd).toHaveBeenCalledWith('url1')
    })
  })

  describe('when a url is removed from the form', () => {
    it('should call the onWhiteListDelete prop with the url', async () => {
      await whitelistForm.find('.whitelist-delete-btn').first().prop('onClick')(event as any)
      expect(onWhitelistDelete).toHaveBeenCalledWith('url1')
    })
  })
})
