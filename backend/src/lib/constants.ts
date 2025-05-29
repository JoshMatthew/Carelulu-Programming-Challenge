class AuthConstants {
  static AUTH_EXPIRATION = Math.floor(Date.now() / 1000) + 60 * 60;
}

export { AuthConstants };
