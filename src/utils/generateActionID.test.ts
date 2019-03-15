import generateActionID from './generateActionID'

describe('actions', () => {
  describe('generateActionID', () => {
    it('strips non-alphanumeric characters from the action', () => {
      const action = {
        account: 'testeostoken',
        name: 'transfer',
        data: {
          from: 'thegazelle',
          to: 'remasteryoda',
          quantity: '1.0000 EOS',
          memo: 'For the future of chains around the world',
        },
      }

      expect(generateActionID(action)).toEqual(
        'accounttesteostokennametransferdatafromthegazelletoremasteryoda'
        + 'quantity1.0000EOSmemoForthefutureofchainsaroundtheworld',
      )
    })
  })
})
