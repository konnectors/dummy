const { BaseKonnector } = require('cozy-konnector-libs')

const konnectorErrors = [
  'CHALLENGE_ASKED',
  'LOGIN_FAILED',
  'LOGIN_FAILED.NEEDS_SECRET',
  'LOGIN_FAILED.TOO_MANY_ATTEMPTS',
  'MAINTENANCE',
  'NOT_EXISTING_DIRECTORY',
  'TERMS_VERSION_MISMATCH',
  'USER_ACTION_NEEDED',
  'USER_ACTION_NEEDED.ACCOUNT_REMOVED',
  'USER_ACTION_NEEDED.CHANGE_PASSWORD',
  'USER_ACTION_NEEDED.PERMISSIONS_CHANGED',
  'VENDOR_DOWN',
  'VENDOR_DOWN.BANK_DOWN',
  'VENDOR_DOWN.LINXO_DOWN'
]

async function start(fields) {
  const timeout = Number(fields.timeout) || 1000
  if (timeout > 0) {
    return new Promise(resolve => {
      setTimeout(() => {
        if (
          !!fields.login &&
          konnectorErrors.includes(fields.login.toUpperCase())
        ) {
          throw new Error(fields.login.toUpperCase())
        }
        resolve()
      }, timeout)
    })
  }
}

module.exports = new BaseKonnector(start)
