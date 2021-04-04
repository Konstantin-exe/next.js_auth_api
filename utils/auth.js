import argon2 from 'argon2';

// const tokens = new Tokens();

export async function hashPassword(password) {
  // console.log(password);
  return argon2.hash(password);
}

export async function doesPasswordMatchPasswordHash(password, passwordHash) {
  return argon2.verify(passwordHash, password);
}

// function createCsrfSecret(sessionToken: string) {
//   return sessionToken + process.env.CSRF_SECRET_SALT;
// }

// export function createCsrfToken(sessionToken: string) {
//   const secret = createCsrfSecret(sessionToken);
//   return tokens.create(secret);
// }

// export function doesCsrfTokenMatchSessionToken(
//   csrfToken: string,
//   sessionToken: string,
// ) {
//   const secret = createCsrfSecret(sessionToken);
//   return tokens.verify(secret, csrfToken);
// }
