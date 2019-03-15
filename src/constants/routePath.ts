enum RoutePath {
  AUTHS = '/auths',
  AUTH_DETAILS = '/authDetails',
  AUTH_DETAILS_VIEW = '/authDetails/:publicKey',
  AUTH_DETAILS_CONFIRM_PASSPHRASE = '/authDetails/:publicKey/confirmPassphrase',
  ADD_AUTH = '/addAuth',
  SELECTIVE_DISCLOSURE = '/selectiveDisclosure',
  TRANSACTION = '/transaction',
  TRANSACTION_APPROVED = '/transaction/approved',
  TRANSACTION_CANCELLED = '/transaction/cancelled',
  TRANSACTION_RICARDIAN = '/transaction/ricardian',
  TRANSACTION_CONFIRM_PASSPHRASE = '/transaction/confirmPassphrase',
  CREATE_PASSPHRASE = '/createPassphrase',
  ERROR = '/error',
  DEVELOPER_SETTINGS = '/developerSettings',
  GENERAL_SETTINGS = '/generalSettings',
}

export default RoutePath
