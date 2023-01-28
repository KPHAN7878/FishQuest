const {Client} = require('pg')

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "stibich1",
    database: "fishquest"
})

client.connect();

client.query(`Select * from users`, (err, res)=>{ //query to select all from a table
    if(!err){
        console.log(res.rows);
    } else{
        console.log(err.message);
    }
    client.end;
})

