/* istanbul ignore file */

const container = require('../src/Infrastructures/container');
const AuthenticationTableTestHelper = require('./AuthenticationsTableTestHelper');
const AuthenticationTokenManager = require('../src/Applications/security/AuthenticationTokenManager');

const ServerTestHelper = {
  login: async (payload) => {
    const tokenManager = container.getInstance(AuthenticationTokenManager.name);
    const accessToken = await tokenManager.createAccessToken(payload);
    const refreshToken = await tokenManager.createRefreshToken(payload);

    await AuthenticationTableTestHelper.addToken(refreshToken);
    return accessToken;
  },
};

module.exports = ServerTestHelper;
