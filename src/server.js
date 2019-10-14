var express = require("express");
var { getActual, config } = require("./image");
var { getStatusHttps } = require("./html");
var { sendSlack } = require("./messages");
var app = express();
const URL_SLACK = "https://hooks.slack.com/services";

//localhost:3000/check/?url=https://www.cvc.com.br/promocao/top-destinos/&width=600&height=324&left=0&top=0&image=https://i.imgur.com/llK99r8.png&slackKey=/T053BAYF0/BPBUACWF7/ib5mB54sGnO2kfjaT9niMg5G
app.get("/check", async function(req, res) {
  const { width, height, left, top, url, image, slackKey } = req.query;
  const configs = {
    width: width * 1,
    height: height * 1,
    left: left * 1,
    top: top * 1
  };

  getActual(url, image, configs, function(props) {
    if (props) {
      if (!props.equal) {
        sendSlack(`${URL_SLACK}${slackKey}`, `Error: ${JSON.stringify(props)}`);
      }
    }
  });
  res.send({ message: "All Okey" });
});

//url=https://www.cvc.com.br/promoca/top-destinos/&width=600&height=324&left=0&top=0
app.get("/save", async function(req, res) {
  const { width, height, left, top, url } = req.query;
  await config(
    url,
    { width: width * 1, height: height * 1, left: left * 1, top: top * 1 },
    function(props) {
      res.send({ url: props });
    }
  );
});

//localhost:3000/has/?url=https://www.cvc.com.br/promoca/top-destinos/&slackKey=/T053BAYF0/BPBUACWF7/ib5mB54sGnO2kfjaT9niMg5G&exptected=Foz do Iguaçu
app.get("/has", async function(req, res) {
  const { url, exptected, slackKey } = req.query;
  getStatusHttps(url, function(props) {
    if (props && !props.includes(exptected)) {
      console.log("Dont has");
      sendSlack(
        `${URL_SLACK}${slackKey}`,
        `Texto "${exptected}" não encontrado em ${url}`
      );
    }
  });
  res.send({ message: "All Okey" });
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
