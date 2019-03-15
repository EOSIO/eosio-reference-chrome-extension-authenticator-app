import '__mocks__/chrome.mock'
import * as SecurityExclusionHelpers from 'utils/manifest/SecurityExclusion'

export const shouldValidate = jest.spyOn(SecurityExclusionHelpers, 'shouldValidate')
