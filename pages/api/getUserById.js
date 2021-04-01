import postgres from 'postgres';
import camelcaseKeys from 'camelcase-keys';

export default async function getUserById(id) {
  const matchingUser = camelcaseKeys(
    await sql`SELECT * FROM users WHERE id = ${id}`,
  );
  return matchingUser;
}
