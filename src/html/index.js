const https = require("https");

const getStatusHttps = (url, cb) => {
  https
    .get(url, resp => {
      let data = "";
      // A chunk of data has been recieved.
      resp.on("data", chunk => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on("end", () => {
        cb({ data: data, statusCode: resp.statusCode });
      });
    })
    .on("error", err => {
      console.log("Error: " + err.message);
    });
};

module.exports = { getStatusHttps };
