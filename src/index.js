const { BaseKonnector } = require('cozy-konnector-libs')
const sleep = require('util').promisify(global.setTimeout)

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
  'USER_ACTION_NEEDED.SCA_REQUIRED',
  'USER_ACTION_NEEDED.OAUTH_OUTDATED',
  'USER_ACTION_NEEDED.PERMISSIONS_CHANGED',
  'VENDOR_DOWN',
  'VENDOR_DOWN.BANK_DOWN',
  'VENDOR_DOWN.LINXO_DOWN'
]

async function start(fields) {
  const timeout = Number(fields.timeout) || 1000
  if (timeout > 0) {
    await sleep(timeout)
    if (
      !!fields.error &&
      konnectorErrors.includes(fields.error.toUpperCase())
    ) {
      throw new Error(fields.error.toUpperCase())
    }
  }
}

module.exports = new BaseKonnector(start)
