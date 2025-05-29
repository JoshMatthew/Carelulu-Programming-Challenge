class AuthConstants {
  static AUTH_EXPIRATION = Math.floor(Date.now() / 1000) + 60 * 60;
}

const UNSAFE_SECRET = 'unsafe_secret';

export { AuthConstants, UNSAFE_SECRET };
