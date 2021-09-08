const puppeteer = require('puppeteer');
const { Handler } = require('../tests/index');
const { getItemType, getTestFunction, filterItemType } = require('../shared/helpers');

exports.testRunner = async (req, res) => {
  const item = req.body.itemPrefix;
  const test = req.body.testFunction;
  const testFailures = req.body.testFailures;
  const testTenant = req.body.tenant;

  const itemType = getItemType(item)[0];
  const { testTitle, itemNamePrefix, defaultTenant, acceptanceCriteria, itemTypeFilter } = getTestFunction(test)[0];
  const { sort, workflow, singleton, itemPrefix } = itemType;

  const testParams = {
    itemType,
    testTitle,
    itemNamePrefix,
    acceptanceCriteria,
    testFailures,
  }

  let resultsString = "";
  let results = [];
  let completed = false;

  if (filterItemType(itemTypeFilter, workflow, singleton, itemPrefix )) {
    return res.json({ 
      result: `
        🦉 ${testTitle} not run for item type ${sort}. ${item}: test is for ${itemTypeFilter} only.
      `, 
    });
  }
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized'] 
  });

  const page = await browser.newPage();

  //  Configure the navigation timeout
  //  added to deal with TimeoutError occurring after so many tests ran
  await page.setDefaultNavigationTimeout(0);

  await page.goto(testTenant ? testTenant : defaultTenant);

  console.log(`❗❗❗ Testing ${testTitle} ${sort}. ${item}...`);
  console.log(`🕒 Test start time: ${new Date().toLocaleTimeString()}`);

  try {

    results = [ ...await Handler[test](testParams, page, results) ];

    const someFailure = results.some(item => item.pass === false);

    resultsString = someFailure ? 
      `❌ ${testTitle} ${sort}. ${item} test completed - some step(s) failed.` 
      : 
      `✔️ ${testTitle} ${sort}. ${item} test completed - all step(s) passed.`;

    completed = true;

  } catch (err) {

    results.push({
      num: 99,
      expected: "n/a",
      actual: 'Unexpected condition encountered',
      pass: false,
    });

    resultsString = `⚠️ ERROR: ${testTitle} ${sort}. ${item}: ${err}`;

  } finally {

    await browser.close();

    console.log(`🕕 Test end time: ${new Date().toLocaleTimeString()}`);
    console.log(resultsString);

  }

  return res.json({ 
    result: resultsString, 
    completed,
  });
  
}