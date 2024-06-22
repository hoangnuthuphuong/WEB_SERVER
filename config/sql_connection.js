//==microsoft server sql==
var cts = {
  server: 'YOUR SERVER NAME',
  database: 'DATABASE NAME',
  user: 'USER LOGIN',
  password: 'PASS',
  port: 1433,
  options: {
            trustServerCertificate: true // change to true for local dev / self-signed certs
          }
};
const roh = "server=PBVSQLPOC1V;Database=ROH_Planning;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
const roh94 = "server=PBV-G1PY8X2\\SQLEXPRESS;Database=ROH_Planning;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";

module.exports={cts,roh,roh94}