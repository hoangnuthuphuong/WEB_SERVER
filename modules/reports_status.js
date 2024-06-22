const {PythonShell} = require('python-shell');
const sql_con=require('../config/sql_connection');
var sql = require('mssql');
const mssql = require("msnodesqlv8");
var express = require("express");
var app = express.Router();
module.exports=app;

app.get('/program_status',function(req,res){
    const query = "Select [PROGRAM],[STATUS],CAST([START_RUN] AS varchar) START_RUN,cast([FINISH_RUN] as varchar) FINISH_RUN,[NOTE],CAST([TIMEUPDATE] AS VARCHAR) TIMEUPDATE from [ROH_planning].[dbo].[AIS2_synch_info] order by program";
    mssql.query(sql_con.roh_con, query, (err, result) => {
        if (err) throw err;
        if (result.length>0)
            {
                res.send(result);
                res.end()
            }
        else{
            res.send('Something went wrong');
            res.end()
        }
    });
})


//======================= DAILY EFFICIENCY ======================
app.post("/DailyEfficiency/Refresh", function(req, res){
    date=req.body.date;
    var options={
        mode:'text',
        pythonPath:'python',
        scriptPath:'./public/Python/Daily_Efficiency',
        pythonOptions:['-u'],
        args:[date]
    }
    console.log(date)
    let shell=new PythonShell('DailyEfficiencyReport - HR.py', options);
    // shell.on('message', function(message){
    //     // res.setHeader("Content-Type", "application/json");
    //     console.log(message)
    //     res.send(message);
    //     res.end();
    // })
});