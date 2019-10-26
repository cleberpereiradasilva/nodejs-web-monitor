# Node Web Monitor

Open source project to check status from a web page.
This server can check and validate status using http status(200), search parts of html content and match a part of web page screen shot.
All alerts will be delivery usin [Slack](https://www.slack.com/)

## Prerequisites

- Knowledge in javasscript
- Knowledge in Slack App

## Dependencies

- "express": "^4.17.1",
- "image-downloader": "^3.5.0",
- "imgur": "^0.3.1",
- "looks-same": "^7.2.1",
- "nodemon": "^1.19.3",
- "phantom": "^6.3.0",
- "phantomjscloud": "^3.5.5",
- "sharp": "^0.23.1",
- "uuid": "^3.3.3"

## Installing

Clone the repository

```
git clone https://github.com/cleberpereiradasilva/node-web-monitor.git
```

Change diretory

```
cd node-web-monitor
```

Install dependencies

```
yarn install
```

## Running the tests

- Work in progress

## Start

```
yarn start
```

Wait for message

`Example app listening on port 3000!`

## Using

### 1. Create your Slack Webhooks in:

`https://api.slack.com/messaging/webhooks`

### 2. You will need using only your **_key_**

_`https://hooks.slack.com/services/`_**T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX**

This _url part_: **T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX**

### 3. Check status **looking for text**

- End Point
  `GET http://localhost:3000/has/`
- Parameters
  - **url** to check
    - `url`\
      example: `url=https://www.cvc.com.br/promoca/top-destinos/`
  - **slack Key**
    - `slackKey`\
      example: `slackKey=/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX`
  - **text** for search
    - `exptected`\
      example: `exptected=Foz do Iguaçu`
- Full url\
  `http://localhost:3000/has/?url=https://www.cvc.com.br/promoca/top-destinos/&slackKey=/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX&exptected=Foz do Iguaçu`

### 4. Check status **looking image match**

#### 4.1 Save the image

- End Point to **save** imagem in [imgur](https://imgur.com/)
  `GET http://localhost:3000/save/`
- Parameters
  - **url** to check
    - `url`\
      example: `url=https://www.cvc.com.br/promoca/top-destinos/`
  - **width**
    - `width`\
      example: `width=600`
  - **height** for search
    - `height`\
      example: `height=324`
  - **left** for search
    - `left`\
      example: `left=0`
  - **top** for search
    - `top`\
      example: `top=0`
- Full url\
  `http://localhost:3000/save/?url=https://www.cvc.com.br/promoca/top-destinos/&width=600&height=324&left=0&top=0`

- The response is `image url`:

  `https://i.imgur.com/099IFAM.png`

  ![https://i.imgur.com/099IFAM.png](./image.png)

#### 4.2 Compare site with image from [imgur](https://imgur.com/)

- End Point to **compare** imagem in [imgur](https://imgur.com/). You can use another image url.
  `GET http://localhost:3000/check/`
- Parameters

  - **url** to check
    - `url`\
       example: `url=https://www.cvc.com.br/promoca/top-destinos/`
  - **width**
    - `width`\
       example: `width=600`
  - **height** for search
    - `height`\
       example: `height=324`
  - **left** for search
    - `left`\
       example: `left=0`
  - **top** for search
    - `top`\
       example: `top=0`
  - **image** url for check
    - `image`\
       example: `image=https://i.imgur.com/099IFAM.png`
  - **slack Key**
    - `slackKey`\
       example: `slackKey=/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX`

- Full url\
  `http://localhost:3000/check/?url=https://www.cvc.com.br/promocao/top-destinos/&width=600&height=324&left=0&top=0&image=https://i.imgur.com/099IFAM.png&slackKey=/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX`

If it doesn't match the images, you'll get a message on your slack channel with both images to see the differences.

#### 4.3 Check http status

- End Point to **status**
  `GET http://localhost:3000/status/`
- Parameters

  - **url** to check
    - `url`\
       example: `url=https://www.cvc.com.br/promoca/top-destinos/`
  - **statusCode** exptected
    - `statusCode`\
      example: `statusCode=200`
  - **slack Key**
    - `slackKey`\
       example: `slackKey=/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX`

- Full url\
  `http://localhost:3000/status/?url=https://www.cvc.com.br/promocao/top-destinos/&statusCode=200&slackKey=/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX`

## Built With

- [Java Script](https://www.w3.org) - The lenguage used
- [NodeJS](https://nodejs.org) - The runtime framework used
- [yarn](https://yarnpkg.com/) - Dependency Management

## Authors

- **Cleber Silva** - _Initial work_ - [cleberpereiradasilva](https://github.com/cleberpereiradasilva)

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://www.mit.edu/~amini/LICENSE.md) file for details

## Acknowledgments

- Java Script
- Inspiration(Java Script)
