import type { NextApiRequest, NextApiResponse } from 'next'
import moment from 'moment'
import { connectToDatabasePostgres } from '../../../libs/postgres'

export default handler

async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	let pool_postgres = await connectToDatabasePostgres()
	switch (req.method) {
		case 'POST':
			await insertUserPoint(req, res, pool_postgres)
			break;
		case 'GET':
			const point = await getUserPoint(req.query.id, pool_postgres)
			res.status(200).json(point)
			break;
		default:
			res.status(500)
			break;
	}
	pool_postgres?.release()
	pool_postgres?.end()
	return res.end()
}

const getUserPoint = async (id: any, pool_postgres: any) => {
	try {
		let selectQuery = `SELECT points FROM users WHERE id=$1`;
		const listUsers = await pool_postgres?.query(selectQuery, [id]);
		return listUsers.rows;
	} catch (err) {
		console.log(err);
	}
}

const insertUserPoint = async (req: any, res: any, pool_postgres: any) => {
	try {
		let createdAt = moment();
		const id = req.query.id;
		let point = req.body.point;
		
		let selectQuery = `INSERT INTO points(user_id, point, created_at) VALUES ($1, $2, $3)`;
		await pool_postgres?.query(selectQuery, [id, point, createdAt]);
		res.status(200).json({ message: 'Insert successfully' })
	} catch (err) {
		console.log(err);
	}
}
