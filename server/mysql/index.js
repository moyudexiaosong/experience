import mysql from "mysql";

//创建连接
let client = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "web2023",
});
//连接数据库

//执行sql
function sqlFn(sql, arr, callback) {
  client.query(sql, arr, function (err, result) {
    console.log(result)
    if (err) {
      console.log(err);
      console.log('连接错误')
      return;
    }
    callback(result);
  });
}


export default sqlFn