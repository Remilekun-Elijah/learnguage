const Cursor = require('pg-cursor')
const cursorFunc = async () => {
const client = await pool.connect()
const cursor = client.query(new Cursor('select * from article'))
cursor.read(100, (err, rows) => {
    if (err) {
      throw err
    }
    console.log(rows)
  })
}


// sample query using database pool
const exampleFunction = async () => {
  const a = await pool.query('select * from article')
  return a.rows;
};