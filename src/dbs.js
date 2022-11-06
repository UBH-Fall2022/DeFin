//import express from "express";

//import { Pool } from 'pg';
//import {Pool, Client} from 'pg';
const { Client } = require('pg');
// breaking apart the url to the cockroach serverless

class storeKeyID {
  username = process.env.CRDB_USERNAME || 'liansolomon02';
  pw = process.env.CRDB_PW|| 'Ci9XJZjU1X-m3Yvil_vfSg';
  cluster = process.env.CRDB_CLUSTER || 'crypto-bank-2614';

  database = process.env.CRDB_DATABASE  || 'defaultdb'; // database
  host = process.env.CRDB_HOST      || 'free-tier11.gcp-us-east1.cockroachlabs.cloud'; // cluster host

  // store the url for database inside connectionString
  connectionString = 'postgresql://' + // use the postgresql wire protocol
      username +                       // username
      ':' +                            // separator between username and pw
      pw +                       // pw
      '@' +                            // separator between username/pw and port
      host +                           // host
      ':' +                            // separator between host and port
      '26257' +                        // port, CockroachDB Serverless always uses 26257
      '/' +                            // separator between port and database
      database +                       // database
      '?' +                            // separator for url parameters
      'sslmode=verify-full' +          // always use verify-full for CockroachDB Serverless
      '&' +                            // url parameter separator
      //'sslrootcert=' +      // full path to ca certificate 
      //'&' +                            // url parameter separator
      'options=--cluster%3D' + cluster // cluster name is passed via the options url parameter
}
const username = process.env.CRDB_USERNAME || 'liansolomon02';
const pw = process.env.CRDB_PW|| 'Ci9XJZjU1X-m3Yvil_vfSg';
const cluster = process.env.CRDB_CLUSTER || 'crypto-bank-2614';

const database = process.env.CRDB_DATABASE  || 'defaultdb'; // database
const host     = process.env.CRDB_HOST      || 'free-tier11.gcp-us-east1.cockroachlabs.cloud'; // cluster host

// store the url for database inside connectionString
const connectionString = 'postgresql://' + // use the postgresql wire protocol
    username +                       // username
    ':' +                            // separator between username and pw
    pw +                       // pw
    '@' +                            // separator between username/pw and port
    host +                           // host
    ':' +                            // separator between host and port
    '26257' +                        // port, CockroachDB Serverless always uses 26257
    '/' +                            // separator between port and database
    database +                       // database
    '?' +                            // separator for url parameters
    'sslmode=verify-full' +          // always use verify-full for CockroachDB Serverless
    '&' +                            // url parameter separator
    //'sslrootcert=' +      // full path to ca certificate 
    //'&' +                            // url parameter separator
    'options=--cluster%3D' + cluster // cluster name is passed via the options url parameter


// need to create a function to store the data from users and transactions
const client = new Client({connectionString});

client.query("CREATE TABLE userIDs (id STRING PRIMARY KEY, name STRING)", (err, res)=> {
    console.log(err,res);
    client.end();
})
/*
const client = new Client({connectionString});

client.connect();
*/
/*
client.connect(err => {
    if (err) {
      console.error('connection error', err.stack)
    } else {
      console.log('connected')
    }
  })
  */

/*
    const pool = new Pool({connectionString});
    
    pool.query("CREATE TABLE userIDs (id STRING PRIMARY KEY, name STRING)", (err, res)=> {
        console.log(err,res);
        pool.end();
    })
    pool.query("INSERT INTO userIDs (id STRING PRIMARY KEY) VALUES ($1)", [pubKey]);
    const { rows } = await pool.query('SELECT * FROM userIDs')
    console.log(rows)
*/