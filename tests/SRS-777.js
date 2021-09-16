//  SRS-777 System Version    //
//  Requirement:  
//  SRS-777: As a user logged into the system, I need the version of the application to display.
//  Acceptance critiera:
//  1. The software version is displayed to a logged-in user.
const { login, logout } = require('./shared/shared');

exports.SRS777 = async ({ itemType }, page) => {
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
  pass = value === "v5.1.3" ? true : false;
  results.push(pass);

  await logout(page);

  return results;

};