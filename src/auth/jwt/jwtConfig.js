export default {
  // Endpoints
  loginEndpoint: '/auth/tenant-login',
  registerEndpoint: '/auth/register',
  refreshEndpoint: '/auth/refresh-token',
  logoutEndpoint: '/auth/logout',

  // This will be prefixed in authorization header with token
  // e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',

  // Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'adminAccessToken',
  storageRefreshTokenKeyName: 'adminRefreshToken',
}
