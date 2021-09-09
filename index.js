const express = require('express');
const puppeteer = require('puppeteer');

const { SRS16 } = require('./tests/SRS-16');

const app = express();

app.set('port', 3003);

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
    
    let results = await SRS16(testParams, page);

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


