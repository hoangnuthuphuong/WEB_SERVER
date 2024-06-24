const sql_con = require("./config/sql_connection");
var sql = require("mssql");
const mssql = require("msnodesqlv8");
var passport = require("passport");
//cau hinh doc ejs
var LocalStrategy = require("passport-local").Strategy;
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var session = require("express-session");
const { PythonShell } = require("python-shell");
var formidable = require("formidable");
const sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database("./database/r1.sqlite3", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the r1 database.");
});
const port = 80;

app.use(express.static("public")); // thư mục chứa file public
app.use(express.static("assets")); // những file trong folder public và access đều có thể nhìn thấy bởi người dùng web

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "secret-ngoikk",
    saveUninitialized: true,
    resave: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const morgan = require("morgan");
// Define a custom token for morgan to include client IP address
morgan.token("client-ip", function (req, res) {
  return req.ip; // Use req.ip to get the client IP address
});
morgan.token("username", function (req, res) {
  return req.user; // Use req.ip to get the client IP address
});
// Custom token for timestamp
morgan.token("datetime", () => {
  const currentDate = new Date();
  const options = {
    timeZone: "Asia/Bangkok", // Set the timezone to GMT+7
    hour12: false, // Use 24-hour format
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return currentDate.toLocaleString("en-US", options);
});
// Use the modified "dev" format with client IP included
app.use(
  morgan(
    ":client-ip :datetime :username :method :url :status :response-time ms - "
  )
);

// var logger = require("morgan");
// app.use(logger("dev"));

// var ais_api = require("./modules/AIS");
var qa_api = require("./modules/ROH_QA");

// app.use("/ais", ais_api);
app.use("/qa", qa_api);

app.set("view engine", "ejs");
app.set("views", "./views");
console.log("Report Server Running");

const { restart } = require("nodemon");

app.get("/", function (request, respone) {
  if (!request.isAuthenticated()) {
    respone.render("AIS/login");
  } else {
    respone.render("ROH_QA/homepage", { ID: request.user });
  }
});

app.get("/huyen", function (request, respone) {
  if (!request.isAuthenticated()) {
    respone.render("AIS/login");
  } else {
    respone.render("ROH_QA/homepage", { ID: request.user });
  }
});

// app.listen(8000, "localhost");
//app.listen(80);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

//======================================LOGIN==============================================

app.post("/change_password_btn", post_isLoggedIn, async (req, res) => {
  let psw = req.body.pass1;
  let username = req.user;
  let query = `UPDATE AIS_setup_user SET PASSWORD='${psw}' WHERE USER_NAME='${username}';`;
  db.run(query, (err) => {
    if (err) {
      console.log("error");
      res.send("error");
      res.end();
      // req.session.destroy()
    } else {
      const query2 = `Select USER_NAME, PASSWORD from AIS_setup_user where USER_NAME='${username}';`;
      db.get(query2, [], (err, row) => {
        if (err) {
          console.error(err.message);
          res.send("error");
          res.end();
        }
        if (row) {
          if (row.PASSWORD == psw) {
            res.send("success");
            res.end();
          } else {
            res.send("error");
            res.end();
          }
        }
      });
    }
  });
});

app.post("/create_account_admin", post_isLoggedIn, async (req, res) => {
  let admin = req.user;
  if (admin != "ngoikk") {
    res.send("error");
    res.end();
  }
  let psw = req.body.pass1;
  let username = req.body.uname;
  let role = req.body.role;
  let query = `insert into AIS_setup_user (user_name,password,note,role,timeupdate) values ('${username}','${psw}','${role}','${role}',CURRENT_TIMESTAMP);`;
  console.log(query);
  db.run(query, (err) => {
    if (err) {
      console.log("error");
      res.send("error");
      res.end();
      // req.session.destroy()
    } else {
      const query2 = `Select USER_NAME, PASSWORD from AIS_setup_user where USER_NAME='${username}';`;
      db.get(query2, [], (err, row) => {
        if (err) {
          console.error(err.message);
          res.send("error");
          res.end();
        }
        if (row) {
          if (row.PASSWORD == psw) {
            res.send("success");
            res.end();
          } else {
            res.send("error");
            res.end();
          }
        }
      });
    }
  });
});

app.get("/login", function (request, response) {
  request.logout();
  response.render("AIS/login");
});
app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/",
  })
);

app.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/login");
    }
  });
});

passport.use(
  new LocalStrategy((username, password, done) => {
    flagLogin = false;
    const query =
      "Select USER_NAME, PASSWORD from AIS_setup_user where USER_NAME='" +
      username +
      "';";
    db.get(query, [], (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      // return row
      if (row) {
        if (row.PASSWORD == password) {
          flagLogin = true;
          return done(null, username);
        }
        if (flagLogin == false) {
          return done(null, false);
        }
      }
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.disable("view cache");

//===============================================================
function isLoggedIn(req, res, next) {
  // Nếu một user đã xác thực, cho đi tiếp
  if (req.isAuthenticated()) return next();
  // Nếu chưa, đưa về trang chủ
  res.redirect(302, "/login");
}
//===============================================================
function post_isLoggedIn(req, res, next) {
  // Nếu một user đã xác thực, cho đi tiếp
  if (req.isAuthenticated()) return next();
  // Nếu chưa, đưa về trang chủ
  res.statusCode = 302;
  res.send("isntLogin");
  res.end();
}
