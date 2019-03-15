import * as React from 'react'
import './WhitelistForm.css'

import FloatingInput from 'components/shared/input/FloatingInput'

interface Props {
  urlList: string[],
  urlInput: string,
  onInput: (e: React.ChangeEvent<HTMLInputElement>) => void,
  error?: Error,
  onWhitelistAdd: (url: string) => void,
  onWhitelistDelete: (url: string) => void,
}

const WhitelistForm: React.SFC<Props> = ({
  urlList,
  urlInput,
  onInput,
  error,
  onWhitelistAdd,
  onWhitelistDelete,
}) => {

  const renderUrlList = () => {
    if (urlList) {
      return urlList.map((url: string) => (
        <div key={url} className='whitelist-url-container'>
          <span className='url'>{url}</span>
          <button
            className='whitelist-delete-btn'
            type='button'
            name={url}
            onClick={() => onWhitelistDelete(url)}
          >
          &times;
          </button>
        </div>
      ))
    }
    return undefined
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onWhitelistAdd(urlInput)
  }

  return(
    <form onSubmit={onSubmit} className='whitelist-form'>
      <div className='whitelist-input-container'>
        <FloatingInput
          placeholder='URL'
          onInput={onInput}
          value={urlInput}
          error={error && error.message}
          className='whitelist-input'
        />
        <button className='whitelist-add-btn' type='submit' name='Save'>Save</button>
      </div>
      <div className='url-list'>
        {renderUrlList()}
      </div>
    </form>
  )
}

export default WhitelistForm
