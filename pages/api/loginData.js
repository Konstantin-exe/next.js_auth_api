// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// export default (req, res) => {
//   res.status(200).json({ status: 'Ok' });
// };

import postgres from 'postgres';
import camelcaseKeys from 'camelcase-keys';
import setPostgresDefaultsOnHeroku from './setPostgresDefaultsOnHeroku';

setPostgresDefaultsOnHeroku();
// require('dotenv-safe').config();

function connectOneTimeToDatabase() {
  let sql;

  if (process.env.NODE_ENV === 'production') {
    // Heroku needs SSL connections but
    // has an "unauthorized" certificate
    // https://devcenter.heroku.com/changelog-items/852
    sql = postgres({ ssl: { rejectUnauthorized: false } });
  } else {
    if (!globalThis.__postgresSqlClient) {
      globalThis.__postgresSqlClient = postgres();
    }
    sql = globalThis.__postgresSqlClient;
  }
  return sql;
}
const sql = connectOneTimeToDatabase();

export async function getUsers() {
  const items = await sql`SELECT * FROM users`;
  return camelcaseKeys(items);
}

export async function getUserById(id) {
  const matchingItem = camelcaseKeys(
    await sql`SELECT * FROM users WHERE id = ${id}`,
  );
  return matchingItem;
}
