import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabasePostgres } from '../../../libs/postgres'

export default handler

async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	let pool_postgres = await connectToDatabasePostgres()

	switch (req.method) {
		case 'PUT':
			await updateUserLevel(req, res, pool_postgres)
			break;
		case 'GET':
			let id = req.query.id
			const userLevel = await getUserLevel(id, pool_postgres)
			res.status(200).json(userLevel)
      break;
		default:
			res.status(500)
			break;
	}

	pool_postgres?.release()
	pool_postgres?.end()
	return res.end()
}

const updateUserLevel = async (req: any, res: any, pool_postgres: any) => {
	try {
		const id = req.query.id
		const level = req.body.level
		let selectQuery = `UPDATE users SET level=$2 WHERE id = $1`;
		await pool_postgres?.query(selectQuery, [id, level]);
		res.status(200).json({ message: 'Update successfully'})
	} catch (err) {
		console.log(err);
	}
}

const getUserLevel = async (id: any, pool_postgres: any) => {
	try {
		if (id) {
			let selectQuery = `SELECT level FROM users WHERE id = $1`;
			const userName = await pool_postgres?.query(selectQuery, [id]);
			return userName.rows[0].level;
		}
	} catch (err) {
		console.log(err);
	}

}
