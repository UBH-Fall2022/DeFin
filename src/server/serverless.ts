import express from "express";

import { Pool } from 'pg';


// breaking apart the url to the cockroach serverless
const username = process.env.CRDB_USERNAME || 'liansolomon02';
const pw = process.env.CRDB_PW|| 'Ci9XJZjU1X-m3Yvil_vfSg';
const cluster = process.env.CRDB_CLUSTER || 'crypto-bank-2614';

const database = process.env.CRDB_DATABASE  || 'defaultdb'; // database
const host     = process.env.CRDB_HOST      || 'free-tier.gcp-us-central1.cockroachlabs.cloud'; // cluster host

// build connection and string to connect to server
const connectionString = 'postgresql://' + // use the postgresql wire protocol
    username +                       // username
    ':' +                            // separator between username and password
    pw +                       // password
    '@' +                            // separator between username/password and port
    host +                           // host
    ':' +                            // separator between host and port
    '26257' +                        // port, CockroachDB Serverless always uses 26257
    '/' +                            // separator between port and database
    database +                       // database
    '?' +                            // separator for url parameters
    'sslmode=verify-full' +          // always use verify-full for CockroachDB Serverless
    '&' +                            // url parameter separator
    'sslrootcert=' +      // full path to ca certificate 
    '&' +                            // url parameter separator
    'options=--cluster%3D' + cluster // cluster name is passed via the options url parameter


// create the query

const pool = new Pool({
    connectionString,
})

const app = express()
const port = 3003

//
// EXECUTE QUERY
//
const getVersion = (_request: any, response: any) => {
  pool.query('SELECT version()', (err: Error, res: any) => {
    if (err) {
        throw err
    }
    response.status(200).json(res.rows)
  })
}

app.get('/', getVersion)

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})

const { Client } = require('pg')

const client = new Client(process.env.DATABASE_URL)

client.connect()
