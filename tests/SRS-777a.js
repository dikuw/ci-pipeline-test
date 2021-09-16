const express = require('express');
const puppeteer = require('puppeteer');

//  SRS-777 System Version    //
//  Requirement:  
//  SRS-777: As a user logged into the system, I need the version of the application to display.
//  Acceptance critiera:
//  1. The software version is displayed to a logged-in user.
const { login, logout } = require('./shared/shared');

const SRS777 = async ({ itemType }, page) => {
  const { owner } = itemType;

  let results = [];
  let pass = false;

  await login(page, owner);
  //  Acceptance criterion 1. The software version is displayed to a logged-in user.
  await page.waitForSelector('#settings-button');
  await page.click('#settings-button');
  let selector = '.MuiTypography-displayInline:nth-of-type(2)';
  await page.waitForSelector(selector);
  let el = await page.$(selector);
  let value = await page.evaluate(el => el.textContent, el);
  pass = value === "v5.1.2" ? true : false;
  results.push(pass);

  await logout(page);

  return results;

};

const app = express();

app.set('port', 3004);

const server = app.listen(app.get('port'), () => {
  console.log(`Express running on port ${server.address().port}`);
});

testRunner = async () => {

  const browser = await puppeteer.launch({ 
    headless: true
  });

  const page = await browser.newPage();
  await page.goto("https://test-company.qms-dry-run.nemedio.com");

  const testParams = {
    itemType: {
      srt1ID: "1",
      itemPrefix: "SOP",
      title: "Standard Operating Procedure",
      workflow: "Generic",
      singleton: false,
      dataValue: "standard_operating_procedure",
      module: "Quality Management System",
      category: "category-standard-operating-procedures",
      user: "pm_user",
      owner: "biz_lead_user",
      approver: "qa_lead_user",
      sort: 21,
    },
    itemNamePrefix: "SOP",
  }

  try {
    
    let results = await SRS777(testParams, page);

    await browser.close();

    if (results.some(item => !item)) {
      console.log('fail');
      process.exit(1);
    } else {
      console.log('pass');
      process.exit(0);
    }

  } catch (err) {

    console.log(err);
    process.exit(1);

  } 
  
}

testRunner();


