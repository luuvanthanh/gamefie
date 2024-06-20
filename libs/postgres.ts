import { Pool } from 'postgres-pool'

export async function connectToDatabasePostgres() {
    try {
        let user = process.env.DB_USER
        let password = process.env.DB_PASSWORD
        let database = process.env.DB_NAME
        let hostName = process.env.DB_HOST
        let hostPort = process.env.DB_PORT
        const pool = new Pool({
            connectionString: `postgres://${user}:${password}@${hostName}:${hostPort}/${database}`,
        });
        const connection = await pool.connect();
        console.log('Connection established')
        return connection
    } catch (error: any) {
        console.log(error);
        console.log('Connect database is error');
    }
}
