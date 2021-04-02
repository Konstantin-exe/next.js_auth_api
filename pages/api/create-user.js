import { createUser, getUserByUsername } from '../../utils/database';
import { hashPassword } from '../../utils/auth';
import Cors from 'cors';
import { createSessionWithCookie } from '../../utils/sessions';
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
  console.log(username, password);

  // 1. save user
  const passwordHash = await hashPassword(password);
  const user = await createUser(username, passwordHash);

  // 2. create session

  // const sessionToken = req.cookies.session;
  // const test = createSessionWithFiveMinuteExpiry();
  // console.log(test);

  const sessionToken = await createSessionWithCookie();
  console.log(sessionToken);

  // if (!doesCsrfTokenMatchSessionToken(csrfToken, sessionToken)) {
  const maxAge = 60 * 60 * 72;
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('token', sessionToken.session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      path: '/',
    }),
  );
  //   return res.status(401).send({
  //     errors: [{ message: 'CSRF Token does not match' }],
  //     user: null,
  //   });
  // }

  //   const userAlreadyExists =
  //     typeof (await getUserByUsername(username)) !== 'undefined';

  //   if (userAlreadyExists) {
  //     return res.status(409).send({
  //       errors: [{ message: 'User already exists with username' }],
  //       user: null,
  //     });
  //   }

  res.status(200);
  res.send({ user: user });
}
