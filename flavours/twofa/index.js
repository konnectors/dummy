const { BaseKonnector } = require('cozy-konnector-libs')

const TWOFA_EXPIRATION_TIMEOUT = 30000

async function start(fields) {
  await this.deactivateAutoSuccessfulLogin()
  const startTime = Date.now()

  const {
    twoFACode,
    twoFATimeout = TWOFA_EXPIRATION_TIMEOUT,
    tries = '1',
    type = 'bank'
  } = fields

  const endTime = startTime + twoFATimeout

  let code = await this.waitForTwoFaCode({
    endTime,
    retry: false,
    type: type
  })

  if (code !== twoFACode && tries === '2') {
    await this.waitForTwoFaCode({ endTime, retry: true, type: type })
  }

  if (code === twoFACode) {
    await this.updateAccountAttributes({ state: 'LOGIN_SUCCESS' })
  } else {
    throw new Error('USER_ACTION_NEEDED.WRONG_TWOFA_CODE')
  }
}

module.exports = new BaseKonnector(start)
