const puppeteer = require("puppeteer");
const { login, logout, createItem, openTableView } = require('./tests/shared/shared');

test("Item instances have Basic Fields according to SRT-12.", async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://test-company.qms-dry-run.nemedio.com");

  try {

    let itemType= {
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
    };

    let itemNamePrefix = "SOP";
    
    const { itemPrefix, dataValue, user, module, headerCategory, category, singleton } = itemType;
  
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
    expect(el.length).toBeGreaterThan(0);
    //  Acceptance criterion 2. All item instances have a Tags field.
    let elementSelector = '[aria-label="Tags MenuFAIL"] span svg';
    el = await page.$eval(elementSelector, () => true).catch(() => false);
    expect(el.length).toBeGreaterThan(0);
    //  Acceptance criterion 3. All item instances have a Comments field.
    await page.click('[data-testid="messagesButton"]');
    await page.waitForTimeout(1000);
    [el] = await page.$x(`//h2[contains(text(), "Comments")]`);
    expect(el.length).toBeGreaterThan(0);
    //  Acceptance criterion 4. All item instances have a History field.
    await page.click('[data-testid="historyButton"]');
    await page.waitForTimeout(1000);
    [el] = await page.$x(`//h2[contains(text(), "History")]`);
    expect(el.length).toBeGreaterThan(0);
    await logout(page);
    
  } finally {

    await browser.close();

  }
}, 120000);