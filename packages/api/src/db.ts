import { Db, MongoClient } from "mongodb";
import { config } from 'dotenv';
config({path: '../../.env'})

const uri = process.env.MONGODB_URI as string;
const dbName = process.env.MONGODB_DBNAME as string;
const client = new MongoClient(uri);

client.on("connectionPoolCreated", () => { 
  console.log("DB connection pool created.") 
});

client.on("connectionPoolClosed", () => { 
  console.log("DB connection pool closed.")
});

client.on("topology closed", () => { 
  console.log("DB topology closed") 
});

await client.connect();

export const db: Db = new Db(client, dbName);
