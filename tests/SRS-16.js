//  SRS-16 Basic Item Data  //
//  Requirement:  All item instances shall have Basic Fields according to SRT-12.
//  Acceptance critiera:
//  1. All item instances have an Item ID field.
//  2. All item instances have a Tags field.
//  3. All item instances have a Comments field.
//  4. All item instances have a History field.
const { login, logout, createItem, openTableView } = require('./shared/shared');

exports.SRS16 = async ({ itemType, itemNamePrefix }, page) => {
  const { itemPrefix, dataValue, user, module, headerCategory, category, singleton } = itemType;

  let results = [];

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
  results.push({ el });
  //  Acceptance criterion 2. All item instances have a Tags field.
  let elementSelector = '[aria-label="Tags MenuFAIL"] span svg';
  el = await page.$eval(elementSelector, () => true).catch(() => false);
  results.push({ el });
  //  Acceptance criterion 3. All item instances have a Comments field.
  await page.click('[data-testid="messagesButton"]');
  await page.waitForTimeout(1000);
  [el] = await page.$x(`//h2[contains(text(), "Comments")]`);
  results.push({ el });
  //  Acceptance criterion 4. All item instances have a History field.
  await page.click('[data-testid="historyButton"]');
  await page.waitForTimeout(1000);
  [el] = await page.$x(`//h2[contains(text(), "History")]`);
  results.push({ el });
  await logout(page);

  return results;
};