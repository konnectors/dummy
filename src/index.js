const { BaseKonnector, log } = require('cozy-konnector-libs')
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
  log('info', `handle2FA account state : ${this._account.state}`)
  log('info', `handle2FA account revision : ${this._account._rev}`)
  const setState = _setState.bind(this)
  const twoFACodeAttempts = _twoFACodeAttempts.bind(this)
  await setState('HANDLE_LOGIN_SUCCESS')
  log(
    'info',
    `handle2FA before attempts account state : ${this._account.state}`
  )
  if (fields.error) {
    if (fields.error === 'USER_ACTION_NEEDED.WRONG_TWOFA_CODE') {
      await twoFACodeAttempts(fields, 1, 5)
    }

    if (fields.error === 'USER_ACTION_NEEDED.TWOFA_EXPIRED') {
      await twoFACodeAttempts(fields, 1, 0)
      await sleep(1000)
    }

    if (fields.error === 'USER_ACTION_NEEDED.WRONG_TWOFA_CODE_2_ATTEMPTS') {
      await twoFACodeAttempts(fields, 2, 3)
    }
    throw new Error(fields.error)
  } else {
    await twoFACodeAttempts(fields, 1, 3)
  }
  log('info', `handle2FA after attempts account state : ${this._account.state}`)
  await setState('LOGIN_SUCCESS')
  log(
    'info',
    `handle2FA after LOGIN_SUCCESS account state : ${this._account.state}`
  )
}

async function _twoFACodeAttempts(fields, nbAttempts = 3, maxDurationMin = 3) {
  const timeout = startTime + maxDurationMin * 60 * 1000
  let retry = false
  for (let i = 1; i <= nbAttempts; i++) {
    if (i > 1) retry = true
    const code = await this.waitForTwoFaCode({ timeout, retry })
    log('info', `Got the ${code} code`)
    await sleep(1000)
  }
}

async function _setState(state) {
  return this.updateAccountAttributes({ state })
}

module.exports = new BaseKonnector(start)