import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabasePostgres } from '../../../libs/postgres'

export const config = {
	api: {
		bodyParser: {
			sizeLimit: '2mb',
		},
	},
}

export default handler


async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let pool_postgres = await connectToDatabasePostgres()
  switch (req.method) {
    case 'POST':
       await console.log(123);
       break;
    case 'GET':
      const user = await getUser(pool_postgres)
      res.status(200).json(user)
      break;
    default:
      res.status(500)
      break;
  }
  pool_postgres?.release()
  pool_postgres?.end()
  return res.end()
}

const getUser = async (pool_postgres: any) => {
	try {
		let selectQuery = `SELECT * FROM users`;
		const listUsers = await pool_postgres?.query(selectQuery)
		return listUsers.rows;
	} catch (err) {
		console.log(err);
	}

}
