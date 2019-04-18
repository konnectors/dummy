const { BaseKonnector, cozyClient, log } = require('cozy-konnector-libs')
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
  'USER_ACTION_NEEDED.OAUTH_OUTDATED',
  'USER_ACTION_NEEDED.PERMISSIONS_CHANGED',
  'VENDOR_DOWN',
  'VENDOR_DOWN.BANK_DOWN',
  'VENDOR_DOWN.LINXO_DOWN'
]

const startTime = Date.now()

async function start(fields) {
  const timeout = Number(fields.timeout) || 1000
  if (timeout > 0) {
    await sleep(timeout)
    if (
      !!fields.error &&
      konnectorErrors.includes(fields.error.toUpperCase())
    ) {
      throw new Error(fields.error.toUpperCase())
    } else if (fields.two_fa_code) {
      log('info', 'Setting 2FA_NEEDED state into the current account')
      await this.updateAccountAttributes({
        state: '2FA_NEEDED'
      })
      const code = await waitFor2FACode.bind(this)()
      log('info', `Got the ${code} code`)
      await sleep(timeout)
      return
    } else {
      return
    }
  }
}

async function waitFor2FACode() {
  const timeout = startTime + 3 * 60 * 1000
  let account = {}
  while (Date.now() < timeout && account['2fa_code'] === undefined) {
    await sleep(5000)
    account = await cozyClient.data.find('io.cozy.accounts', this.accountId)
    log('info', `${account['2fa_code']}`)
  }

  if (account['2fa_code'] !== undefined) {
    return account['2fa_code']
  }
  throw new Error('LOGIN_FAILED.2FA_EXPIRED')
}

module.exports = new BaseKonnector(start)
