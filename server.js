'use strict'

const express = require( 'express' );
const cors = require( 'cors' );
const pg = require( 'pg' );
const bodyParser = require('body-parser')

const app = express();
const PORT = process.env.PORT || 3000;
const urlencodedParser = bodyParser.urlencoded({extended: true});


console.log( process.env.DATABASE_URL );
const client = new pg.Client('postgres://postgres:hello@localhost:5432/books_app');
client.connect();
client.on( 'error', err => console.error( err ) );

app.use( cors() );

app.get('/api/v1/books', (req, res) => {
  let sql = `SELECT * FROM books;`;
  client.query(sql, (err, data) => {
    if(err) {
      res.send('ya goofed ya dingus')
    }
    res.send(data);
  })
}) 

app.get('/api/v1/books/:singleBookId', (req, res) => {
  let {singleBookId} = req.params;
  console.log(req.params.singleBookId);  
  let sql= `SELECT * FROM books WHERE book_id=$1;`
  let values = [singleBookId]

  client.query(sql, values)
    .then(data => res.send(data.rows))
})

app.post('/api/v1/books/', (req, res) => {
  let {title, author, isbn, image_url, description} = req.body;
  let sql = `INSERT INTO books(title, author, isbn, image_url, description) 
  VALUES ($1, $2, $3, $4, $5)`;
  let values = [title, author, isbn, image_url, description];

  client.query(sql, values)
    .then(res.sendStatus(201))
    .catch(console.error);
});
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

