const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017";

const dbName = "TTVEmoteStats";

let _db = null;

async function connectToDb() {
  return new Promise((resolve, reject) => {
    if (_db) resolve();

    MongoClient.connect(url, (err, client) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        _db = client.db(dbName);
        console.log("Successfully connected to MongoDB");
        resolve();
      }
    });
  });
}

function getDb() {
  return _db;
}

module.exports = {
  connectToDb,
  getDb,
};
