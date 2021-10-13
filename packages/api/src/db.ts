import { AnyError, Db, MongoClient } from "mongodb";

const url = "mongodb://localhost:27017";
const dbName = "TTVEmoteStats";

let _db: Db;

export async function connectToDb(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (_db) resolve(undefined);

    MongoClient.connect(url, (err?: AnyError, client?: MongoClient) => {
      if (err) {
        console.error(err);
        reject(err);
      } else if (client) {
        _db = client.db(dbName);
        console.log("Successfully connected to MongoDB");
        resolve(undefined);
      } else {
        reject("Error connecting to MongoDb")
      }
    });
  });
}

export async function getDb(): Promise<Db> {
  if (!_db) {
    await connectToDb();
    return _db;
  }
  else return _db;
}

