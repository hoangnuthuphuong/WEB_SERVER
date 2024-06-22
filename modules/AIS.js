const { PythonShell } = require("python-shell");
const sql_con = require("../config/sql_connection");
var sql = require("mssql");
var formidable = require("formidable");
var fs = require("fs");
// const mssql = require("msnodesqlv8");
var express = require("express");
var app = express.Router();
module.exports = app;
const mssql = require("msnodesqlv8");
// const mssql = require("mssql");
// Function work with query
async function executeQuery(query, connectionString) {
  return new Promise((resolve, reject) => {
    mssql.query(connectionString, query, (error, rows) => {
      if (error) {
        console.error("Error:", error);
        reject(error);
      } else {
        resolve(rows);
      }
    });
  });
}
//===============================================================
function isLoggedIn(req, res, next) {
  // Nếu một user đã xác thực, cho đi tiếp
  if (req.isAuthenticated()) return next();
  // Nếu chưa, đưa về trang chủ
  res.statusCode = 302;
  res.redirect("/login");
}
//===============================================================
function post_isLoggedIn(req, res, next) {
  // Nếu một user đã xác thực, cho đi tiếp
  if (req.isAuthenticated()) return next();
  // Nếu chưa, đưa về trang chủ
  res.statusCode = 302;
  res.send("isntLogin");
}

//==============================================================================    BOM API
app.get("/update_bom_actual_usage", isLoggedIn, function (req, res) {
  res.render("AIS/update_BOM_usage");
});
app.post("/Upload_Bom", post_isLoggedIn, function (req, res) {
  let ts = Date.now();
  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();
  var dsubmit = year + "-" + month + "-" + date;
  // prints date & time in YYYY-MM-DD format
  var user = req.user;
  var formData = new formidable.IncomingForm();
  var excelfile = "";
  formData.parse(req, function (error, fields, files) {
    var extension = files.file_excel.name.substr(
      files.file_excel.name.lastIndexOf(".")
    );
    if (extension == ".xlsx") {
      excelfile = user + "_" + dsubmit + "_Actual_Bom";
      var newPath = "public/uploaded/Bom/" + excelfile + extension;
      fs.rename(files.file_excel.path, newPath, function (errorRename) {
        // result.send("File saved = " + newPath);
        if (errorRename) {
          res.send("cannot save file");
          res.end();
        } else {
          let options = {
            mode: "text",
            pythonPath: "python",
            pythonOptions: ["-u"], // get print results in real-time
            scriptPath: "./python_code/upload/", //If you are having python_test.py script in same folder, then it's optional.
            args: [excelfile + extension, user],
          };
          PythonShell.run("upload_Bom.py", options, function (err, result) {
            if (err) throw err;
            res.send(result.toString());
            res.end();
          });
        }
      });
    } else {
      res.send("wrong format of file uploaded");
      res.end();
    }
  });
});

app.post("/Bom_search_style", post_isLoggedIn, async (req, res) => {
  try {
    let style = req.body.style_cd;
    let query = `SELECT *
                FROM [ROH_planning].[dbo].[AIS2_data_actual_usage]
                WHERE STYLE_CD='${style}' order by PLANT_CD,STYLE_CD,COLOR_CD,SIZE_CD`;

    let result = await executeQuery(query, sql_con.roh); // Await the function call
    res.send(result);
    res.end();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred");
  }
});

app.post("/download_Bom", post_isLoggedIn, async (req, res) => {
  let plant = req.body.plant;
  let options = {
    mode: "text",
    pythonPath: "python",
    pythonOptions: ["-u"], // get print results in real-time
    scriptPath: "./python_code/download/", //If you are having python_test.py script in same folder, then it's optional.
    args: [plant],
  };
  PythonShell.run("download_Bom.py", options, function (err, result) {
    if (err) throw err;
    res.send(result.toString());
    res.end();
  });
});
// ===============================================================================   Substitution
app.get("/update_substitution", isLoggedIn, function (req, res) {
  res.render("AIS/update_substitution-v2");
});
app.post("/Upload_substitute", post_isLoggedIn, function (req, res) {
  let ts = Date.now();
  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();
  var dsubmit = year + "-" + month + "-" + date;
  // prints date & time in YYYY-MM-DD format

  var user = req.user;
  var formData = new formidable.IncomingForm();
  var excelfile = "";
  formData.parse(req, function (error, fields, files) {
    var extension = files.file_excel.name.substr(
      files.file_excel.name.lastIndexOf(".")
    );
    if (extension == ".xlsx") {
      excelfile = user + "_" + dsubmit + "_Substitution";
      var newPath = "public/uploaded/substitution/" + excelfile + extension;
      fs.rename(files.file_excel.path, newPath, function (errorRename) {
        // result.send("File saved = " + newPath);
        if (errorRename) {
          res.send("cannot save file");
          res.end();
        } else {
          let options = {
            mode: "text",
            pythonPath: "python",
            pythonOptions: ["-u"], // get print results in real-time
            scriptPath: "./python_code/upload/", //If you are having python_test.py script in same folder, then it's optional.
            args: [excelfile + extension, user],
          };
          PythonShell.run(
            "upload_substitution_v2.py",
            options,
            function (err, result) {
              if (err) throw err;
              res.send(result.toString());
              res.end();
            }
          );
        }
      });
    } else {
      res.send("wrong format of file uploaded");
      res.end();
    }
  });
});
app.post("/substitute_search_style", post_isLoggedIn, async (req, res) => {
  try {
    let style = req.body.org_style;
    let query = `SELECT *
                FROM [ROH_planning].[dbo].[AIS2_data_substitution]
                WHERE ORG_STYLE='${style}' order by ORG_ATTRIBUTE,ORG_SIZE`;

    let result = await executeQuery(query, sql_con.roh); // Await the function call
    res.send(result);
    res.end();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred");
  }
});
app.post("/download_substitution", post_isLoggedIn, async (req, res) => {
  let plant = req.body.plant;
  let options = {
    mode: "text",
    pythonPath: "python",
    pythonOptions: ["-u"], // get print results in real-time
    scriptPath: "./python_code/download/", //If you are having python_test.py script in same folder, then it's optional.
    args: [plant],
  };
  PythonShell.run("download_substitute.py", options, function (err, result) {
    if (err) throw err;
    res.send(result.toString());
    res.end();
  });
});
// ================================================================================  INTIMATES LEADTIME
app.get("/IT_update_style_leadtime", isLoggedIn, function (req, res) {
  res.render("AIS/IT_update_style_leadtime");
});
app.post("/it_search_style_selling", post_isLoggedIn, async (req, res) => {
  try {
    let style = req.body.selling_style;
    let query = `SELECT * FROM [ROH_planning].[dbo].[AIS2_STYLE_LEADTIME_INTIMATES] WHERE STYLE='${style}'`;
    let result = await executeQuery(query, sql_con.roh);
    res.send(result);
    res.end();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred");
  }
});
app.post("/it_download_style_leadtime", post_isLoggedIn, async (req, res) => {
  let options = {
    mode: "text",
    pythonPath: "python",
    pythonOptions: ["-u"], // get print results in real-time
    scriptPath: "./python_code/download/", //If you are having python_test.py script in same folder, then it's optional.
    args: [],
  };
  PythonShell.run("download_leadtime.py", options, function (err, result) {
    if (err) throw err;
    res.send(result.toString());
    res.end();
  });
});
app.post("/Upload_it_leadtime", post_isLoggedIn, function (req, res) {
  let ts = Date.now();
  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();
  var dsubmit = year + "-" + month + "-" + date;
  // prints date & time in YYYY-MM-DD format
  var user = req.user;
  var formData = new formidable.IncomingForm();
  var excelfile = "";
  formData.parse(req, function (error, fields, files) {
    var extension = files.file_excel.name.substr(
      files.file_excel.name.lastIndexOf(".")
    );
    if (extension == ".xlsx") {
      excelfile = user + "_" + dsubmit + "_IT_leadtime";
      var newPath = "public/uploaded/IT/Leadtime/" + excelfile + extension;
      fs.rename(files.file_excel.path, newPath, function (errorRename) {
        // result.send("File saved = " + newPath);
        if (errorRename) {
          res.send("cannot save file");
          res.end();
        } else {
          let options = {
            mode: "text",
            pythonPath: "python",
            pythonOptions: ["-u"], // get print results in real-time
            scriptPath: "./python_code/upload/", //If you are having python_test.py script in same folder, then it's optional.
            args: [excelfile + extension, user],
          };
          PythonShell.run(
            "upload_leadtime.py",
            options,
            function (err, result) {
              if (err) throw err;
              res.send(result.toString());
              res.end();
            }
          );
        }
      });
    } else {
      res.send("wrong format of file uploaded");
      res.end();
    }
  });
});
// ================================================================================  R3 ITEM LEADTIME
app.get("/R3_item_leadtime", isLoggedIn, function (req, res) {
  res.render("AIS/R3_item_leadtime");
});
app.post("/download_r3_item", post_isLoggedIn, async (req, res) => {
  let plant = req.body.plant;
  let options = {
    mode: "text",
    pythonPath: "python",
    pythonOptions: ["-u"], // get print results in real-time
    scriptPath: "./python_code/download/", //If you are having python_test.py script in same folder, then it's optional.
    args: [plant],
  };
  PythonShell.run("download_r3_item.py", options, function (err, result) {
    if (err) throw err;
    res.send(result.toString());
    res.end();
  });
});

//=============================================================================     LEADTIME US MPP
app.get("/styleleadtime", (req, res) => {
  res.render("AIS/style_leadtime");
});
app.get("/data_style_leadtime", (req, res) => {
  let query = `select * from dbo.AIS2_STYLE_LEADTIME_CONSTRAIN order by CONSTRAIN_TYPE,WORKCENTER,STYLE,NOTE`;
  mssql.query(sql_con.roh, query, (err, result) => {
    if (err) {
      res.send("something went wrong");
      res.end();
      throw err;
    }
    if (result.length > 0) {
      res.send(result);
      res.end();
    } else {
      res.send("something went wrong");
      res.end();
    }
  });
});
app.get("/update_US_workcenter", (req, res) => {
  var records = [
    { ID: 1, MEGA_WC: "...", UserUpdate: "...", TimeUpdate: "..." },
    // Add more records as needed
  ];
  let query = `SELECT  
                  ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS ID
                  ,[MEGA_WC]
                  ,[UserUpdate]
                  ,CONVERT(varchar, TimeUpdate, 120) AS TimeUpdate
              FROM [ROH_planning].[dbo].[AIS2_setup_wc]
              WHERE BU='US Basic'
              `;
  mssql.query(sql_con.roh, query, (err, records) => {
    if (err) {
      res.send("something went wrong");
      res.end();
      throw err;
    }
    res.render("AIS/US_workcenter.ejs", { records });
    res.end();
  });
});
app.post("/download_style_mpp", post_isLoggedIn, async (req, res) => {
  let options = {
    mode: "text",
    pythonPath: "python",
    pythonOptions: ["-u"], // get print results in real-time
    scriptPath: "./python_code/download/", //If you are having python_test.py script in same folder, then it's optional.
    args: [],
  };
  PythonShell.run("download_leadtime_mpp.py", options, function (err, result) {
    if (err) throw err;
    res.send(result.toString());
    res.end();
  });
});

//==============================================================================     WEB APP FOR INTIMATE
app.get("/change_password", isLoggedIn, function (req, res) {
  res.render("AIS/change_password", { username: req.user });
});
app.get("/create_account", isLoggedIn, function (req, res) {
  res.render("AIS/create_user");
});
// API POST REQUEST
app.post("/delete_MegaWC", async (req, res) => {
  try {
    let mega = req.body.megaWC;
    let query = `DELETE
                FROM [ROH_planning].[dbo].[AIS2_setup_wc]
                WHERE MEGA_WC='${mega}'`;

    let result = await executeQuery(query, sql_con.roh); // Await the function call
    res.send(
      `Thank you for your submission \n ${mega} has been deleted from the list`
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred");
  }
});
