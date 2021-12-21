const Pool = require('pg').Pool;
require("dotenv").config();

const prodConfig = process.env.DATABASE_URL;

const devConfig = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;

const pool = new Pool({
    connectionString: process.env.NODE_ENV === "production" ? prodConfig : devConfig,
    ssl:{
        rejectUnauthorized: false
    }
});

module.exports = pool;

/* ssl:{
    rejectUnauthorized: false
} */