import postgres from 'postgres';
import camelcaseKeys from 'camelcase-keys';

export async function deleteUserById(id) {
  const users = await sql`
    DELETE FROM
      users
    WHERE
      id = ${id}
    RETURNING *
  `;
}
