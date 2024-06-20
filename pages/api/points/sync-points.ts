import type { NextApiRequest, NextApiResponse } from 'next'
import moment from 'moment'
import { connectToDatabasePostgres } from '../../../libs/postgres'

export default handler

async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	let pool_postgres = await connectToDatabasePostgres()
    await syncPoint(pool_postgres)
    res.status(200).json({message: 'Sync Successfully'})

	pool_postgres?.release()
	pool_postgres?.end()
	return res.end()
}

const syncPoint = async (pool_postgres: any) => {
	try {
        let syncTime = moment().utcOffset('+0:00');
		let selectQuery = `SELECT user_id, SUM(point) AS total_points
                            FROM points WHERE created_at <= $1
                            GROUP BY user_id;`;
		const listUsersPoint = await pool_postgres?.query(selectQuery, [syncTime]);
        let updateQuery = `UPDATE users SET points = points + $2 WHERE id =$1`;

		listUsersPoint.rows.forEach( async (userPoint: any)  => {
            let new_pool_postgres = await connectToDatabasePostgres()
            await new_pool_postgres?.query(updateQuery,[userPoint.user_id, userPoint.total_points]);
        });

        let deleteQuery = `DELETE FROM points WHERE created_at <=$1`;
        await pool_postgres?.query(deleteQuery, [syncTime]);
        
	} catch (err) {
		console.log(err);
	}
}
