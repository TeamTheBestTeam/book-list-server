'use strict'

const express = require( 'express' );
const cors = require( 'cors' );
const pg = require( 'pg' );

const app = express();
const PORT = process.env.PORT;

console.log( process.env.DATABASE_URL );
const client = new pg.Client('postgres://postgres:jplaw@localhost:5432/books_app');
client.connect();
client.on( 'error', err => console.error( err ) );

app.use( cors() );

app.get( '/', ( req, res ) => res.send( 'Testing 1, 2, 3' ) );

app.get( '*', ( req, res ) => res.status( 403 ).send( 'This route does not exist' ) );

loadDB()
app.listen( PORT, () => console.log( `Listening on port: ${PORT}` ) );

function loadDB() {
  console.log('in load');
  
  client.query(
    `CREATE TABLE IF NOT EXISTS books(
        book_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(100) NOT NULL,
        image_url VARCHAR (255),
        isbn VARCHAR(13));`
  )
}
