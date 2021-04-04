import {
  createSessionByUserId,
  createUser,
  getUserByUsername,
  getUserWithHashedPasswordByUsername,
} from '../../utils/database';
import { hashPassword } from '../../utils/auth';
import Cors from 'cors';
import { createSessionWithCookie } from '../../utils/sessions';
import { doesPasswordMatchPasswordHash } from '../../utils/auth';
import cookie from 'cookie';

const cors = Cors({
  methods: ['GET', 'HEAD', 'POST'],
  origin: 'http://localhost:8080',
  credentials: true,
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);
  const { username, password } = req.body;
  // const sessionToken = req.cookies.session;

  const userWithPasswordHash = await getUserWithHashedPasswordByUsername(
    username,
  );

  // Error out if the username does not exist
  if (!userWithPasswordHash) {
    return res.status(401).send({
      errors: [{ message: 'Username or password does not match' }],
      user: null,
    });
  }

  const passwordHash = userWithPasswordHash.passwordHash;

  const passwordMatches = await doesPasswordMatchPasswordHash(
    password,
    passwordHash,
  );
  // Error out if the password does not match the hash
  if (!passwordMatches) {
    return res.status(401).send({
      errors: [{ message: 'Username or password does not match' }],
      user: null,
    });
  }

  const session = await createSessionByUserId(userWithPasswordHash.id);
  console.log(passwordMatches);

  const maxAge = 60 * 60 * 72;
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('token', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      path: '/',
    }),
  );
  res.status(200);
  res.send({ user: 'user' });
}
