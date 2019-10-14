var request = require("request");

//curl -X POST -H 'Content-type: application/json' --data '{"text":"Hello, World!"}' https://hooks.slack.com/services/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
const sendSlack = (url, message) => {
  var options = {
    uri: url,
    method: "POST",
    json: {
      text: message
    }
  };

  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body.id); // Print the shortened url.
    }
  });
};

module.exports = { sendSlack };
