const express = require('express');
const puppeteer = require('puppeteer');

const { SRS16 } = require('./tests/SRS-16');

const app = express();

app.set('port', 3003);

const server = app.listen(app.get('port'), () => {
  console.log(`Express running on port ${server.address().port}`);
});

testRunner = async (server) => {

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
    
    let results = await SRS16(testParams, page);

    results.some(item => item.pass === false) ? console.log('fail') : console.log('pass');

  } catch (err) {

    console.log(err);

  } finally {

    await browser.close();

    process.exit(0);

  }
  
}

testRunner();


