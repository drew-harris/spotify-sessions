import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

// create the connection
const poolConnection = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  port: parseInt(process.env.MYSQLPORT || "7384"),
  database: process.env.MYSQLDATABASE,
  multipleStatements: true,
});

export const db = drizzle(poolConnection);

// this will automatically run needed migrations on the database
