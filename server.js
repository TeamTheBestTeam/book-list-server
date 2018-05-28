'use strict'

const express = require( 'express' );
const cors = require( 'cors' );
const pg = require( 'pg' );

const app = express();
const PORT = process.env.PORT;

const client = new pg.Client( process.env.DATABASE_URL );
client.connect();
client.on( 'error', err => console.error( err ) );

app.use( cors() );

app.get( '/', ( req, res ) => res.send( 'Testing 1, 2, 3' ) );

app.post( '/api/v1/books', ( request, response ) => {
  client.query(
    `
      INSERT INTO books (title, author, isbn, image_url, description)
      VALUES ($1, $2, $3, $4, $5);
    `,
    [
      request.body.title,
      request.body.author,
      request.body.isbn,
      request.body.image_url,
      request.body.description,
    ]
  )
    .then( result => {
      response.send( 'wahoo it worked.' );
    } )
    .catch( err => console.error( err ) );
} )


app.get( '*', ( req, res ) => res.status( 403 ).send( 'This route does not exist' ) );

app.listen( PORT, () => console.log( `Listening on port: ${PORT}` ) );

