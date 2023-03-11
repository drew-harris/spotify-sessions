import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

// create the connection
const poolConnection = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  port: parseInt(process.env.MYSQLPORT || "7384"),
  database: process.env.MYSQLDATABASE,
  multipleStatements: true,
});

const db = drizzle(poolConnection);

// this will automatically run needed migrations on the database

const runMigration = async () => {
  try {
    console.log("Migrating");
    await migrate(db, { migrationsFolder: "./drizzle" });
  } catch (error) {
    console.error(error);
  }
};

runMigration();
