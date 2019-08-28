const { BaseKonnector } = require('cozy-konnector-libs')

const TWOFA_EXPIRATION_TIMEOUT = 30000

async function start(fields) {
  const startTime = Date.now()

  const {
    twoFACode,
    twoFATimeout = TWOFA_EXPIRATION_TIMEOUT,
    tries = '1'
  } = fields

  const endTime = startTime + twoFATimeout

  let code = await this.waitForTwoFaCode({
    timeout: endTime,
    retry: false
  })

  if (code !== twoFACode && tries === '2') {
    await this.waitForTwoFaCode({ timeout: endTime, retry: true })
  }

  if (code === twoFACode) {
    await this.updateAccountAttributes({ state: 'LOGIN_SUCCESS' })
  } else {
    throw new Error('USER_ACTION_NEEDED.WRONG_TWOFA_CODE')
  }
}

module.exports = new BaseKonnector(start)
