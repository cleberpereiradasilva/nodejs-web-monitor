const fs = require("fs");
const phantomJsCloud = require("phantomjscloud");
const looksSame = require("looks-same");
const sharp = require("sharp");
const uuid = require("uuid/v1");
const download = require("image-downloader");
var imgur = require("imgur");
//free keys on planthonJsCloud site
const keys = [
  "ak-y9qfg-d507v-b30qt-w5eg2-rqjws",
  "ak-9y1gn-8vxzm-j25cx-3nm0d-sw5ea",
  "ak-b774t-11ag9-amaym-w5xq5-ydh9f"
];
const browser = new phantomJsCloud.BrowserApi(
  "ak-b774t-11ag9-amaym-w5xq5-ydh9f"
);
imgur.getClientId();

const removeFile = file => {
  try {
    fs.unlinkSync(file);
  } catch (err) {}
};

const checkImage = (actual, compare, cb) => {
  looksSame(actual, compare, function(error, equal) {
    removeFile(actual);
    if (!equal || !equal.equal) {
      saveImageInImgUrl(compare, props => {
        removeFile(compare);
        cb(props);
      });
    } else {
      removeFile(compare);
      cb(equal);
    }
  });
};

const downloadImage = async (url, imagem) => {
  const options = {
    url,
    dest: "./" + imagem
  };

  try {
    const { filename, image } = await download.image(options);
    console.log("filename", filename);
  } catch (e) {
    console.log("Error in downloadImage");
    console.error(e);
  }
};

const saveImageInImgUrl = (path, cb) => {
  console.log("Salvando ", path);
  imgur
    .uploadFile(path)
    .then(function(json) {
      cb(json.data.link);
    })
    .catch(function(err) {
      console.log("Error in saveImageInImgUrl");
      console.error(err.message);
    });
};

const initialConfig = async (url, configs, actual, actualCroped, cb) => {
  await browser.requestSingle(
    {
      url,
      renderType: "png"
    },
    async (err, userResponse) => {
      if (err != null) {
        console.log("Error in initialConfig");
        throw err;
      }

      const data = JSON.stringify(userResponse.content.data)
        .replace(/^data:image\/\w+;base64,/, "")
        .replace('"', "");

      await fs.writeFileSync(actual, data, "base64");
      await sharp(actual)
        .extract(configs)
        .toFile(actualCroped)
        .then(function(new_file_info) {
          saveImageInImgUrl(actualCroped, cb);
        })
        .catch(e => {
          console.log(e);
        });
    }
  );
};

const getActualImage = async (url, configs, actual, actualCroped) => {
  await browser.requestSingle(
    {
      url,
      renderType: "png"
    },
    async (err, userResponse) => {
      if (err != null) {
        console.log("Error in getActualImage", url);
        console.log(err);
        throw err;
      }

      const data = JSON.stringify(userResponse.content.data)
        .replace(/^data:image\/\w+;base64,/, "")
        .replace('"', "");

      await fs.writeFileSync(actual, data, "base64");
      await sharp(actual)
        .extract(configs)
        .toFile(actualCroped)
        .then(function(new_file_info) {})
        .catch(e => {
          console.log("Error in sharp");
          console.log(e);
        });
    }
  );
};

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

const checkState = actual => {
  return fs.existsSync(actual);
};

const config = async (url, configs, cb) => {
  const key = uuid();
  const actual = `site_actual_${key}.png`;
  const actualCroped = `image_actual_croped_${key}.png`;

  await initialConfig(url, configs, actual, actualCroped, cb);
  while (!checkState(actualCroped)) {
    await sleep(2000);
  }
  removeFile(actual);
  removeFile(actualCroped);
};

//config(url, configs); // OK

const check = async (url, imageFromWeg) => {
  await downloadImage(url, imageFromWeg);
};

const getActual = async (url, img, configs, cb) => {
  const key = uuid();
  const actual = `site_actual_${key}.png`;
  const imageToday = `image_today_croped_${key}.png`;
  const imageFromWeg = `theImage_${key}.png`;
  await check(img, imageFromWeg);
  while (!checkState(imageFromWeg)) {
    await sleep(2000);
  }

  await getActualImage(url, configs, actual, imageToday);
  while (!checkState(imageToday)) {
    await sleep(2000);
  }
  await checkImage(imageFromWeg, imageToday, cb);
  removeFile(actual);
};

module.exports = { getActual, config };

//getActual(url, "https://i.imgur.com/llK99r8.png", configs, exampleFunction);
