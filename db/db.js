import { Pool } from"pg";
import 'dotenv/config'


const pool=new Pool({
    connectionString:process.env.DATABASEURL,
});

export default pool