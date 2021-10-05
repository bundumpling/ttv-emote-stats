const fs = require("fs");

const readConfigJSON = async () => {
  return new Promise((resolve, reject) => {
    fs.readFile("./config.json", "utf8", (err, data) => {
      if (err) {
        console.log(`Error reading config file: ${err}`);
        reject();
      } else {
        return resolve(JSON.parse(data));
      }
    });
  });
};

const writeConfigJSON = (config) => {
  const data = JSON.stringify(config);
  fs.writeFile("./config.json", data, "utf8", (err) => {
    if (err) {
      console.log(`Error writing config file: ${err}`);
    } else {
      console.log(`Config file updated`);
    }
  });
};

module.exports = {
  readConfigJSON,
  writeConfigJSON,
};
