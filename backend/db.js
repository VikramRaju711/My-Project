const Pool = require("pg").Pool;

const pool = new Pool({
  user: "vikram",
  password: "12345678",
  host: "localhost",
  port: 5432,
  database: "project",
});

module.exports = pool;
