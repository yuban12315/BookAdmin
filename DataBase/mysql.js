var mysql=require("mysql");

var db={};
db.conn=mysql.createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'',
    database:'bookadmin',
    port:3306,
    multipleStatements: true
});
module.exports=db;