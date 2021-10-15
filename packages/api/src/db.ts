import { Db, MongoClient } from "mongodb";
import { envConfig } from "@ttv-emote-stats/common";

const { uri, dbName } = envConfig.mongoDB;

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
