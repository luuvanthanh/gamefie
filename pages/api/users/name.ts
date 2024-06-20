import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabasePostgres } from '../../../libs/postgres'

export default handler

async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	let pool_postgres = await connectToDatabasePostgres()

	const userName = await getUserName(req.query.id, pool_postgres)
	res.status(200).json(userName)
	pool_postgres?.release()
	pool_postgres?.end()
	return res.end()
}

const getUserName = async (id: any, pool_postgres: any) => {
	try {
		if (id) {
			let selectQuery = `SELECT name FROM users WHERE id = $1`;
			const userName = await pool_postgres?.query(selectQuery, [id]);
			return userName.rows[0].name;
		}
	} catch (err) {
		console.log(err);
	}

}
