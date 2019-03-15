import * as SameOriginValidator from 'utils/sameOrigin/SameOriginValidator'

export const validateSameOriginPolicy = jest.fn()

jest.spyOn(SameOriginValidator, 'default').mockImplementation(() => ({
  validateSameOriginPolicy,
}))
