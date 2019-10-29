var express = require("express");
var { getActual, config } = require("./image");
var { getStatusHttps } = require("./html");
var { sendSlack } = require("./messages");
var app = express();
const URL_SLACK = "https://hooks.slack.com/services";

const check_call_back = slackKey =>
  function(props) {
    if (!props.equal) {
      sendSlack(`${URL_SLACK}${slackKey}`, `Error: ${JSON.stringify(props)}`);
    }
  };

const has_call_back = (exptected, slackKey) =>
  function(props) {
    if (props.data && !props.data.includes(exptected)) {
      sendSlack(
        `${URL_SLACK}${slackKey}`,
        `Texto "${exptected}" não encontrado. Url: ${props.url}`
      );
    }
  };

const status_call_back = (statusCode, slackKey) =>
  function(props) {
    if (props.data && props.statusCode !== statusCode) {
      sendSlack(
        `${URL_SLACK}${slackKey}`,
        `Código "${props.statusCode}" não esperado. Era esperado ${statusCode}. Url: ${props.url}`
      );
    }
  };

const check_list_call_back = props => {
  if (props.data) {
    console.log({ data: JSON.parse(props.data) });
  }
};
//localhost:3000/save/?url=https://www.cvc.com.br/promoca/top-destinos/&width=600&height=324&left=0&top=0
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

//localhost:3000/check/?url=https://www.cvc.com.br/promocao/top-destinos/&width=600&height=324&left=0&top=0&image=https://i.imgur.com/llK99r8.png&slackKey=/TCPDAUW5A/BPWEY3VU4/hJb2vXS10W3VZl6tB2uYFSxN
app.get("/check", async function(req, res) {
  const { width, height, left, top, url, image, slackKey } = req.query;
  const configs = {
    width: width * 1,
    height: height * 1,
    left: left * 1,
    top: top * 1
  };
  getActual(url, image, configs, check_call_back(slackKey));
  res.send({ message: "All Okey" });
});

//localhost:3000/acke-api/
app.get("/fake-api", async function(req, res) {
  const json_object = [
    {
      type: "check",
      url: "https://www.cvc.com.br/promocao/top-destinos/",
      width: "600",
      height: "324",
      left: "0",
      top: "0",
      image:
        "https://i.imgur.com/llK99r8.png&slackKey=/TCPDAUW5A/BPWEY3VU4/hJb2vXS10W3VZl6tB2uYFSxN"
    }
  ];
  res.send(json_object);
});

//localhost:3000/check-list/?url=/fake-api
app.get("/check-list", async function(req, res) {
  const { url } = req.query;
  getStatusHttps(url, check_list_call_back);
  res.send({ message: "All Okey" });
});

//localhost:3000/has/?url=https://www.cvc.com.br/promoca/top-destinos/&slackKey=/TCPDAUW5A/BPWEY3VU4/hJb2vXS10W3VZl6tB2uYFSxN&exptected=Foz do Iguaçu
app.get("/has", async function(req, res) {
  const { url, exptected, slackKey } = req.query;
  getStatusHttps(url, has_call_back(exptected, slackKey));
  res.send({ message: "All Okey" });
});

//localhost:3000/status/?url=https://www.cvc.com.br/promoca/top-destinos/&slackKey=/TCPDAUW5A/BPWEY3VU4/hJb2vXS10W3VZl6tB2uYFSxN&statusCode=200
app.get("/status", async function(req, res) {
  const { url, statusCode, slackKey } = req.query;
  getStatusHttps(url, status_call_back(statusCode, slackKey));
  res.send({ message: "All Okey" });
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
