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
  if (fields.error) {
    if (fields.error === 'USER_ACTION_NEEDED.WRONG_TWOFA_CODE') {
      await twoFACodeAttempts.bind(this)(fields, 1, 0)
      await sleep(1000)
    }

    if (fields.error === 'USER_ACTION_NEEDED.TWOFA_EXPIRED') {
      await twoFACodeAttempts.bind(this)(fields, 1, 0)
      await sleep(1000)
    }

    if (fields.error === 'USER_ACTION_NEEDED.WRONG_TWOFA_CODE_2_ATTEMPTS') {
      await twoFACodeAttempts.bind(this)(fields, 2, 3)
    }
    throw new Error(fields.error)
  } else {
    await twoFACodeAttempts.bind(this)(fields, 1, 3)
  }
}

async function twoFACodeAttempts(fields, nbAttempts = 3, maxDurationMin = 3) {
  const timeout = startTime + maxDurationMin * 60 * 1000
  let state = 'TWOFA_NEEDED'
  for (let i = 1; i <= nbAttempts; i++) {
    if (i > 1) state = 'TWOFA_NEEDED_RETRY'
    log('info', `Setting ${state} state into the current account`)
    await this.updateAccountAttributes({ state })

    const code = await this.waitForTwoFaCode({ timeout })
    log('info', `Got the ${code} code`)
    await sleep(1000)
  }
}

module.exports = new BaseKonnector(start)
