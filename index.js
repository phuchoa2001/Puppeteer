const app = require("express")();
const axios = require('axios');

const UserModel = require('./app/models/user');

const db = require('./config/db/index')

let chrome = {};
let puppeteer;


let numberAll = 0;


db.connect();

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = require("chrome-aws-lambda");
  puppeteer = require("puppeteer-core");
} else {
  puppeteer = require("puppeteer");
}

app.get("/phuchoa00/:all", async (req, res) => {
  let options = {};

  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    options = {
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    };
  }

  try {
    let browser = await puppeteer.launch(options);

    let page = await browser.newPage();
    await page.setViewport({
      width: 1400,
      height: 1000,
    });
    async function GetAll() {
      await page.goto(`https://dichthuatphuongdong.com/tienich/random-vietnamese-profile.html`);
      const User = await page.evaluate(() => {
        const resultArr = {};
        const Users = document.querySelectorAll('table.table.common-table tbody tr')
        for (let i = 0; i < Users.length; i++) {
          const item = Users[i];
          const ItemArr = item.querySelectorAll("td");
          const key = ItemArr[0].querySelector("span").innerText.replace(/\s/g, '');
          const value = ItemArr[1].querySelector("strong").innerText;
          resultArr[key] = value;
        }
        return resultArr;
      })

      const Info = await page.evaluate(() => {
        const resultArr = {};
        const Address = document.querySelectorAll('table.table')[1];
        const Info = Address.querySelectorAll("tbody tr");
        for (let i = 1; i < Info.length; i++) {
          const item = Info[i];
          const ItemArr = item.querySelectorAll("td");
          const key = ItemArr[0].innerText.replace(/\s/g, '');
          const value = ItemArr[1].querySelector("strong").innerText;
          resultArr[key] = value;
        }
        return resultArr;
      })
      const Info2 = await page.evaluate(() => {
        const resultArr = {};
        const Address = document.querySelectorAll('table.table')[2];
        const Info = Address.querySelectorAll("tbody tr");
        for (let i = 1; i < Info.length; i++) {
          const item = Info[i];
          const ItemArr = item.querySelectorAll("td");
          const key = ItemArr[0].innerText.replace(/\s/g, '');
          const value = ItemArr[1].querySelector("strong").innerText;
          resultArr[key] = value;
        }
        return resultArr;
      })
      const Info3 = await page.evaluate(() => {
        const resultArr = {};
        const Address = document.querySelectorAll('table.table')[3];
        const Info = Address.querySelectorAll("tbody tr");
        for (let i = 1; i < Info.length; i++) {
          const item = Info[i];
          const ItemArr = item.querySelectorAll("td");
          const key = ItemArr[0].innerText.replace(/\s/g, '');
          const value = ItemArr[1].querySelector("strong").innerText;
          resultArr[key] = value;
        }
        return resultArr;
      })

      const Users = { ...User, ...Info, ...Info2, ...Info3 };
      const post = new UserModel(Users);
      post.save();
      await browser.close();
      res.json(Users);
    }
    GetAll();
  } catch (err) {
    console.error(err);
    return null;
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});

module.exports = app;
