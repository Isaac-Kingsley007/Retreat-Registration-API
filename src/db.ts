import Database from "better-sqlite3";
import { config } from 'dotenv';

config();

const name = process.env.DATABASE_NAME;
const db = new Database('./' + name);

export default db;