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
			await updateLimitEnergy(req, res, pool_postgres)
			break;
		case 'GET':
			let id = req.query.id
			const levelEnergy = await getUserLevelEnergy(id, pool_postgres)
			res.status(200).json(levelEnergy)
			break;
		default:
			res.status(500)
			break;
	}

	pool_postgres?.release()
	pool_postgres?.end()
	return res.end()
}

const updateLimitEnergy = async (req: any, res: any, pool_postgres: any) => {
	try {
		const id = req.query.id
		const limit_energy = req.body.limit_energy
		let selectQuery = `UPDATE users SET limit_energy=$2 WHERE id = $1`;
		await pool_postgres?.query(selectQuery, [id, limit_energy]);
		res.status(200).json({ message: 'Update successfully' })
	} catch (err) {
		console.log(err);
	}
}

const getUserLevelEnergy = async (id: any, pool_postgres: any) => {
	try {
		if (id) {
			let selectQuery = `SELECT limit_energy FROM users WHERE id = $1`;
			const user = await pool_postgres?.query(selectQuery, [id]);
			return user.rows[0].limit_energy;
		}
	} catch (err) {
		console.log(err);
	}

}

