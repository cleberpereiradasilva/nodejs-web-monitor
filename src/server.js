var express = require("express");
var { getActual, config } = require("./image");
var { getStatusHttps } = require("./html");
var { sendSlack } = require("./messages");
var app = express();
const URL_SLACK = "https://hooks.slack.com/services";

const check_call_back = ({ slackKey }) =>
  function(props) {
    if (!props.equal) {
      sendSlack(
        `${URL_SLACK}${slackKey}`,
        `Error: ${JSON.stringify(props)}. Url: ${props.url}`
      );
    }
  };

const has_call_back = ({ exptected, slackKey }) =>
  function(props) {
    if (props.data && !props.data.includes(exptected)) {
      sendSlack(
        `${URL_SLACK}${slackKey}`,
        `Texto "${exptected}" não encontrado. Url: ${props.url}`
      );
    }
  };

const status_call_back = ({ statusCode, slackKey }) =>
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
    const list = JSON.parse(props.data);

    list.map(item => {
      const { url, type } = item;

      switch (type) {
        case "check":
          getActual(item, check_call_back(item));

          break;
        case "has":
          getStatusHttps(url, has_call_back(item));

          break;

        case "status":
          getStatusHttps(url, status_call_back(item));

          break;
      }
    });
  }
};

const config_call_back = res => props => res.send({ url: props });

//localhost:3000/fake-api/
app.get("/fake-api", async function(req, res) {
  const json_object = [
    {
      type: "check",
      url: "https://www.cvc.com.br/promoca/top-destinos/",
      width: "600",
      height: "324",
      left: "0",
      top: "0",
      image: "https://i.imgur.com/llK99r8.png",
      slackKey: "/TCPDAUW5A/BPWEY3VU4/hJb2vXS10W3VZl6tB2uYFSxN"
    },
    {
      type: "has",
      url: "https://www.cvc.com.br/promocao/top-destinos/",
      exptected: "Foz do Iguaçua",
      slackKey: "/TCPDAUW5A/BPWEY3VU4/hJb2vXS10W3VZl6tB2uYFSxN"
    },
    {
      type: "status",
      url: "https://www.cvc.com.br/promocao/top-destinos/",
      statusCode: "200",
      slackKey: "/TCPDAUW5A/BPWEY3VU4/hJb2vXS10W3VZl6tB2uYFSxN"
    }
  ];
  res.send(json_object);
});

//localhost:3000/check-list/?url=http://localhost:3000/fake-api
app.get("/check-list", async function(req, res) {
  const { url } = req.query;
  getStatusHttps(url, check_list_call_back);
  res.send({ message: "All Okey" });
});

//localhost:3000/save/?url=https://www.cvc.com.br/promoca/top-destinos/&width=600&height=324&left=0&top=0
app.get("/save", async function(req, res) {
  await config(req.query, config_call_back(res));
});

//localhost:3000/check/?url=https://www.cvc.com.br/promocao/top-destinos/&width=600&height=324&left=0&top=0&image=https://i.imgur.com/llK99r8.png&slackKey=/TCPDAUW5A/BPWEY3VU4/hJb2vXS10W3VZl6tB2uYFSxN
app.get("/check", async function(req, res) {
  getActual(req.query, check_call_back(req.query));
  res.send({ message: "All Okey" });
});

//localhost:3000/has/?url=https://www.cvc.com.br/promoca/top-destinos/&slackKey=/TCPDAUW5A/BPWEY3VU4/hJb2vXS10W3VZl6tB2uYFSxN&exptected=Foz do Iguaçu
app.get("/has", async function(req, res) {
  const { url } = req.query;
  getStatusHttps(url, has_call_back(req.query));
  res.send({ message: "All Okey" });
});

//localhost:3000/status/?url=https://www.cvc.com.br/promoca/top-destinos/&slackKey=/TCPDAUW5A/BPWEY3VU4/hJb2vXS10W3VZl6tB2uYFSxN&statusCode=200
app.get("/status", async function(req, res) {
  const { url } = req.query;
  getStatusHttps(url, status_call_back(req.query));
  res.send({ message: "All Okey" });
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
