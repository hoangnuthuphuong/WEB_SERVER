const {PythonShell} = require('python-shell');
const sql_con=require('../config/sql_connection');
var sql = require('mssql');
var formidable= require("formidable")
var fs = require('fs');
// const mssql = require("msnodesqlv8");
var express = require("express");
var app = express.Router();
module.exports=app;
const mssql = require("msnodesqlv8");
// Function work with query
async function executeQuery(query, connectionString) {
    return new Promise((resolve, reject) => {
      mssql.query(connectionString, query, (error, rows) => {
        if (error) {
          console.error('Error:', error);
          reject(error);
        } else {
          resolve(rows);
        };
          
        }
      );
    });
}
//===============================================================
function isLoggedIn(req, res, next) {
  // Nếu một user đã xác thực, cho đi tiếp
  if (req.isAuthenticated())
      return next();
  // Nếu chưa, đưa về trang chủ
  res.statusCode=302;
  res.redirect('/login');
}
//===============================================================
function post_isLoggedIn(req, res, next) {
  // Nếu một user đã xác thực, cho đi tiếp
  if (req.isAuthenticated())
      return next();
  // Nếu chưa, đưa về trang chủ
  res.statusCode=302;
  res.send('isntLogin');
}
//===============================================================
app.get('/Download_ANET',(req,res)=>{
    res.render('ROH_QA/download_record');
})
app.post('/download_typo', async (req, res) => {
  let frdate=req.body.fromdate;
  let todate=req.body.todate;

  let options = {
    mode: 'text',
    pythonPath: 'python',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: './python_code/download/', //If you are having python_test.py script in same folder, then it's optional.
    args:[frdate,todate]
  };
  PythonShell.run('download_anet_typo.py', options, function(err, result) {
      if (err) throw err;
      res.send(result.toString())
      res.end();
  });


  
});



