const express = require('express');
const puppeteer = require('puppeteer');

//  SRS-16 Basic Item Data  //
//  Requirement:  All item instances shall have Basic Fields according to SRT-12.
//  Acceptance critiera:
//  1. All item instances have an Item ID field.
//  2. All item instances have a Tags field.
//  3. All item instances have a Comments field.
//  4. All item instances have a History field.
const { login, logout, createItem, openTableView } = require('./shared/shared');

const SRS16 = async ({ itemType, itemNamePrefix }, page) => {
  const { itemPrefix, dataValue, user, module, headerCategory, category, singleton } = itemType;

  let results = [];
  let pass = false;

  await login(page, user);

  if (!singleton) {
    await createItem(page, dataValue, itemNamePrefix);
    await page.waitForTimeout(2000);
  } else {
    //  This actually opens Builder view in this case, since singletons don't have Table view
    await openTableView(page, module, headerCategory, category);
    await page.waitForTimeout(2000);
  }
  //  Acceptance criterion 1. All item instances have an Item ID field.
  let [el] = await page.$x(`//h2[contains(text(), "${itemPrefix}-")]`);
  pass = el ? true : false;
  results.push(pass);
  //  Acceptance criterion 2. All item instances have a Tags field.
  let elementSelector = '[aria-label="Tags Menu"] span svg';
  pass = await page.$eval(elementSelector, () => true).catch(() => false);
  results.push(pass);
  //  Acceptance criterion 3. All item instances have a Comments field.
  await page.click('[data-testid="messagesButton"]');
  await page.waitForTimeout(1000);
  [el] = await page.$x(`//h2[contains(text(), "Comments")]`);
  pass = el ? true : false;
  results.push(pass);
  //  Acceptance criterion 4. All item instances have a History field.
  await page.click('[data-testid="historyButton"]');
  await page.waitForTimeout(1000);
  [el] = await page.$x(`//h2[contains(text(), "History")]`);
  pass = el ? true : false;
  results.push(pass);

  await logout(page);

  return results;
};

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