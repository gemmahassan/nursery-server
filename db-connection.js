const mysql = require('mysql');

const con = mysql.createConnection({
  host: "r6ze0q02l4me77k3.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
  user: "j3hfj9eli46n6fma",
  password: "vlm0y85pis2i322c",
  port: "3306",
  database: "edm194ac963zsybs"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});