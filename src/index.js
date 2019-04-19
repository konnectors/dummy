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
      await handle2FA.bind(this)(fields)
      return
    } else {
      return
    }
  }
}

async function handle2FA(fields) {
  log('info', 'Setting TWOFA_NEEDED state into the current account')
  await this.updateAccountAttributes({
    state: 'TWOFA_NEEDED'
  })

  // 2FA code expires here after 1s for test
  if (!!fields.error && fields.error === 'LOGIN_FAILED.TWOFA_EXPIRED') {
    await sleep(1000)
    throw new Error(fields.error)
  }

  const code = await waitForTwoFACode.bind(this)()
  log('info', `Got the ${code} code`)
  await sleep(1000)

  if (!!fields.error && fields.error === 'LOGIN_FAILED.WRONG_TWOFA_CODE') {
    throw new Error(fields.error)
  }
}

async function waitForTwoFACode() {
  const timeout = startTime + 3 * 60 * 1000
  let account = {}

  // init code to null in the account
  await this.updateAccountAttributes({
    twofa_code: null
  })

  while (Date.now() < timeout && !account.twofa_code) {
    await sleep(5000)
    account = await cozyClient.data.find('io.cozy.accounts', this.accountId)
    log('info', `${account.twofa_code}`)
  }

  if (account.twofa_code) {
    return account.twofa_code
  }
  throw new Error('LOGIN_FAILED.TWOFA_EXPIRED')
}

module.exports = new BaseKonnector(start)
