import * as React from 'react'
import './Contract.css'

interface Props {
  ricardianContractHTML: string
}

const Contract: React.SFC<Props> = ({ ricardianContractHTML }) => {
  return (
    <div className='contract' dangerouslySetInnerHTML={{ __html: ricardianContractHTML }} />
  )
}

Contract.displayName = 'Contract'

export default Contract
