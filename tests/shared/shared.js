const password = 'testpass0';

exports.login = async (page, username) => {
  await page.waitForSelector('#username');
  await page.type("#username", username);
  await page.type("#password", password);
  await page.click('[data-testid="login-button"]');
};

exports.logout = async (page) => {
  await page.click('#profile-button');
  await page.waitForTimeout(1000);
  await page.waitForSelector('#sign-out');
  await page.click('#sign-out');
};

exports.switchUser = async (page, user, module, headerCategory, category) => {
  //  logout
  await page.click('#profile-button');
  await page.waitForTimeout(1000);
  await page.waitForSelector('#sign-out');
  await page.click('#sign-out');
  //  login
  await page.waitForSelector('#username');
  await page.type("#username", user);
  await page.type("#password", password);
  await page.click('[data-testid="login-button"]');
  //  openTableView
  await page.waitForSelector('#workspace-selector-button');
  await page.click('#workspace-selector-button');
  await page.waitForTimeout(1000);
  let [el] = await page.$x(`//div[contains(text(), "${module}")]`);
  await page.waitForTimeout(1000);
  await el.click();
  await page.waitForTimeout(1000);
  if (headerCategory) await page.click(`#${headerCategory}`);
  await page.waitForTimeout(1000);
  await page.waitForSelector(`#${category}`);
  await page.click(`#${category}`);
  //  selectTableViewLastChild
  await page.waitForTimeout(1000);
  await page.waitForSelector('tbody.MuiTableBody-root tr:nth-last-child(1)');
  await page.click('tbody.MuiTableBody-root tr:nth-last-child(1)');
  await page.waitForTimeout(1000);
};

exports.deleteText = async (page, input) => {
  let el = await page.$(input);
  await el.click({ clickCount: 3 })
  await page.keyboard.press('Backspace');
};

//  SRT-7.4, SRT-58.21 Does Not Exist -> Draft
exports.createItem = async (page, dataValue, itemNamePrefix) => {
  //  creates a new item and opens it in Builder view
  await page.waitForSelector('#create-item-button');
  await page.click('#create-item-button');
  await page.waitForTimeout(1000);
  await page.click('[id="mui-component-select-itemType"]');
  await page.waitForTimeout(500);
  await page.waitForSelector(`[data-value="${dataValue}"]`);
  await page.click(`[data-value="${dataValue}"] p`);
  await page.click('[data-testid="item-type-selector"] #item-name-input');
  await page.type('[data-testid="item-type-selector"] #item-name-input', `${itemNamePrefix} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit", second: "2-digit", hour12: false })}`);                                                                                                  
  await page.waitForSelector('#item-create-btn');
  await page.waitForTimeout(1000);
  await page.click('[data-testid="item-type-selector"] #item-create-btn');
  await page.waitForTimeout(1000);
  await page.waitForSelector('.MuiButton-textSizeSmall');
  await page.click('.MuiButton-textSizeSmall');
};

exports.openTableView = async (page, module, headerCategory, category) => {
  await page.waitForSelector('#workspace-selector-button');
  await page.click('#workspace-selector-button');
  await page.waitForTimeout(1000);
  let [el] = await page.$x(`//div[contains(text(), "${module}")]`);
  await page.waitForTimeout(1000);
  await el.click();
  await page.waitForTimeout(1000);
  if (headerCategory) await page.click(`#${headerCategory}`);
  await page.waitForTimeout(1000);
  await page.waitForSelector(`#${category}`);
  await page.click(`#${category}`);
};

exports.selectTableViewLastChild = async (page) => {
  await page.waitForTimeout(1000);
  await page.waitForSelector('tbody.MuiTableBody-root tr:nth-last-child(1)');
  await page.click('tbody.MuiTableBody-root tr:nth-last-child(1)');
  await page.waitForTimeout(1000);
};

//  SRT-7.34, SRT-58.22 Draft -> Under Review
exports.draftToUnderReview = async (page) => {
  await page.waitForSelector('#workflow-underReview');
  await page.click('#workflow-underReview');
  await page.waitForSelector('[data-testid="btn-yes"]');
  await page.click('[data-testid="btn-yes"]');
};

//  SRT-7.1 Under Review -> Owner Approval
exports.underReviewToOwnerApproval = async (page, owner, CO) => {
  await page.waitForSelector('[data-testid="item"] #workflow-ownerApproval');
  await page.click('[data-testid="item"] #workflow-ownerApproval');
  await page.click('[data-testid="btn-yes"]');
  await page.type('#reason-for-change', 'Test RoC');
  await page.type('#need-description', 'Test DoC');
  await page.click('#change-summary-submit');
  if (CO) {
    await page.click('#co-yes');
    await page.waitForSelector("#select-co-input");
    await page.click("#select-co-input");
    await page.click("#react-autowhatever-1 ul li:nth-last-child(1)");
    await page.click("#select-co-button");
  } else {
    await page.click('#transition-modal [type="button"]');
    let el = await page.$('.MuiPaper-elevation1 #change-justify');
    await el.click();
    await el.type("Test justification");
    await page.waitForSelector('#change-justify');
    await page.click('#justify-next');
  }
  await page.click('#signature-checkbox');
  await page.type('#username', owner);
  await page.type('#password', password);
  await page.click('[type="submit"]');
  await page.waitForTimeout(1000);
};

//  SRT-58.36 Under Review -> Ready for Closure
exports.underReviewToReadyForClosure = async (page, owner) => {
  await page.waitForSelector('[data-testid="item"] #workflow-ownerApproval');
  await page.click('[data-testid="item"] #workflow-ownerApproval');
  await page.click('[data-testid="btn-yes"]');
  await page.click('[type="checkbox"]');
  await page.type("#username", owner);
  await page.type("#password", password);
  await page.click('[type="submit"]');
}

//  SRT-7.2 Owner Approval -> Approved Draft
exports.ownerApprovalToApprovedDraft = async (page, approver) => {
  await page.waitForSelector('[data-testid="item"] #workflow-approvedDraft');
  await page.click('[data-testid="item"] #workflow-approvedDraft');
  await page.click('[data-testid="btn-yes"]');
  await page.click('[type="checkbox"]');
  await page.type("#username", approver);
  await page.type("#password", password);
  await page.click('[type="submit"]');
};

// SRT-7.3 Approved Draft -> Released
exports.ownerApprovalToReleased = async (page, approver) => {
  await page.waitForSelector('[data-testid="item"] #workflow-released');
  await page.click('[data-testid="item"] #workflow-released');
  await page.click('[data-testid="btn-yes"]');
  await page.click('[type="checkbox"]');
  await page.type("#username", approver);
  await page.type("#password", password);
  await page.click('[type="submit"]');
};

//  SRT-58.23 Ready for Closure -> Closed
exports.readyForClosureToClosed = async (page, approver) => {
  await page.waitForSelector('[data-testid="item"] #workflow-closed');
  await page.click('[data-testid="item"] #workflow-closed');
  await page.click("#co-close-yes");
  await page.click('[type="checkbox"]');;
  await page.type("#username", approver);
  await page.type("#password", password);
  await page.click('[type="submit"]');
};

exports.draftToReadyForClosure = async (page, owner) => {
  await page.waitForSelector('[data-testid="item"] #workflow-underReview');
  await page.click('[data-testid="item"] #workflow-underReview');
  await page.click('[data-testid="btn-yes"]');
  await page.waitForTimeout(1000);
  await page.waitForSelector('#workflow-ownerApproval');
  await page.click('#workflow-ownerApproval');
  await page.click('[data-testid="btn-yes"]');
  await page.waitForSelector('[type="checkbox"]');
  await page.click('[type="checkbox"]');
  await page.type("#username", owner);
  await page.type("#password", password);
  await page.click('[type="submit"]');
};

exports.readyForClosureToClosed = async (page, approver) => {
  await page.waitForSelector('[data-testid="item"] #workflow-closed');
  await page.click('[data-testid="item"] #workflow-closed');
  await page.click("#co-close-yes");
  await page.click('[type="checkbox"]');
  await page.type("#username", approver);
  await page.type("#password", password);
  await page.click('[type="submit"]'); 
};

//  SRT-7.35, SRT-52.18, SRT-58.37 Under Review -> Draft
exports.underReviewToDraft = async (page) => {
  await page.waitForSelector('[data-testid="item"] #workflow-ownerApproval');
  await page.click('[data-testid="item"] #workflow-ownerApproval');
  await page.waitForSelector('[data-testid="btn-no"]');
  await page.click('[data-testid="btn-no"]');
};

//  SRT-7.107 Owner Approval -> Void
exports.voidOwnerApproval = async (page, owner) => {
  await page.waitForSelector('[data-testid="item"] .MuiPaper-root [aria-label="Ellipses Menu"]');
  await page.click('[data-testid="item"] .MuiPaper-root [aria-label="Ellipses Menu"]');
  let [el] = await page.$x(`//li[contains(text(), "Void")]`);
  await page.waitForTimeout(1000);
  await el.click();
  await page.type('[placeholder="Insert reason here*"]', "Test void reason");
  await page.type("#username", owner);
  await page.type("#password", password);
  await page.click('[type="submit"]');
};

exports.voidOwnerApprovalSets = async (page, owner) => {
  await page.waitForSelector('[data-testid="item"] .MuiPaper-root [aria-label="Ellipses Menu"]');
  await page.click('[data-testid="item"] .MuiPaper-root [aria-label="Ellipses Menu"]');
  let [el] = await page.$x(`//li[contains(text(), "Void")]`);
  await page.waitForTimeout(1000);
  await el.click();
  await page.waitForSelector('[data-testid="btn-yes"]');
  await page.click('[data-testid="btn-yes"]');
  await page.type('[placeholder="Insert reason here*"]', "Test void reason");
  await page.type("#username", owner);
  await page.type("#password", password);
  await page.click('[type="submit"]');
};

//  SRT-58.62 Ready for Closure -> Void
exports.voidReadyForClosure= async (page, approver) => {
  await page.waitForSelector('[data-testid="item"] .MuiPaper-root [aria-label="Ellipses Menu"]');
  await page.click('[data-testid="item"] .MuiPaper-root [aria-label="Ellipses Menu"]');
  let [el] = await page.$x(`//li[contains(text(), "Void")]`);
  await page.waitForTimeout(1000);
  await el.click();
  await page.waitForSelector('[data-testid="btn-yes"]');
  await page.click('[data-testid="btn-yes"]');
  await page.type('[placeholder="Insert reason here*"]', "Test void reason");
  await page.type("#username", approver);
  await page.type("#password", password);
  await page.click('[type="submit"]');
};

//  SRT-7.6 Owner Approval -> Rejected
exports.ownerApprovalToRejected = async (page, approver) => {
  await page.waitForSelector('[data-testid="item"] #workflow-approvedDraft');
  await page.click('[data-testid="item"] #workflow-approvedDraft');
  await page.waitForSelector('[data-testid="btn-no"]');
  await page.click('[data-testid="btn-no"]');
  await page.type('[placeholder="Insert reason here*"]', "Test reject reason");
  await page.type("#username", approver);
  await page.type("#password", password);
  await page.click('[type="submit"]');
};

//  SRT-58.24 Ready for Closure -> Rejected
exports.readyForClosureToRejected = async (page, approver) => {
  await page.waitForSelector('[data-testid="item"] #workflow-closed');
  await page.click('[data-testid="item"] #workflow-closed');
  await page.waitForSelector('#co-close-no');
  await page.click('#co-close-no');
  await page.type('[placeholder="Insert reason here*"]', "Test reject reason");
  await page.type("#username", approver);
  await page.type("#password", password);
  await page.click('[type="submit"]');
};

//  SRT-7.7 Rejected -> Draft
exports.rejectedToDraft = async (page) => {
  await page.waitForSelector('[data-testid="item"] #workflow-rejected');
  await page.click('[data-testid="item"] #workflow-rejected');
  await page.click('[type="submit"]'); 
};

//  SRT-7.93 Approved Draft -> Void
exports.voidApprovedDraft = async (page, approver) => {
  await page.waitForSelector('[data-testid="item"] .MuiPaper-root [aria-label="Ellipses Menu"]');
  await page.click('[data-testid="item"] .MuiPaper-root [aria-label="Ellipses Menu"]');
  let [el] = await page.$x(`//li[contains(text(), "Void")]`);
  await page.waitForTimeout(1000);
  await el.click();
  await page.type('[placeholder="Insert reason here*"]', "Test void reason");
  await page.type("#username", approver);
  await page.type("#password", password);
  await page.click('[type="submit"]');
};

//  SRT-52.38 Approved Draft -> Void
exports.voidApprovedDraftSets = async (page, approver) => {
  await page.waitForSelector('[data-testid="item"] .MuiPaper-root [aria-label="Ellipses Menu"]');
  await page.click('[data-testid="item"] .MuiPaper-root [aria-label="Ellipses Menu"]');
  let [el] = await page.$x(`//li[contains(text(), "Void")]`);
  await page.waitForTimeout(1000);
  await el.click();
  await page.waitForSelector('[data-testid="btn-yes"]');
  await page.click('[data-testid="btn-yes"]');
  await page.type('[placeholder="Insert reason here*"]', "Test void reason");
  await page.type("#username", approver);
  await page.type("#password", password);
  await page.click('[type="submit"]');
};

 //  SRT-7.127 Under Review -> Canceled
exports.underReviewToCanceled = async (page, owner) => {
  await page.waitForSelector('[data-testid="item"] .MuiPaper-root [aria-label="Ellipses Menu"]');
  await page.click('[data-testid="item"] .MuiPaper-root [aria-label="Ellipses Menu"]');
  await page.waitForSelector('[role="menuitem"]');
  await page.click('[role="menuitem"]');
  await page.type('[placeholder="Insert reason here*"]', "Test cancel reason");
  await page.type("#username", owner);
  await page.type("#password", password);
  await page.click('[type="submit"]');
};

//  SRT-58.61 Under Review -> Canceled
exports.draftorUnderReviewToCanceledForCO = async (page, owner) => {
  await page.waitForSelector('[data-testid="item"] .MuiPaper-root [aria-label="Ellipses Menu"]');
  await page.click('[data-testid="item"] .MuiPaper-root [aria-label="Ellipses Menu"]');
  await page.waitForTimeout(1000);
  await page.waitForSelector('[role="menuitem"]');
  await page.click('[role="menuitem"]');
  await page.waitForSelector('#btn-yes');
  await page.click('#btn-yes');
  await page.waitForTimeout(1000);
  let el = await page.$('.MuiPaper-elevation1 #change-justify');
  await el.click();
  await el.type("Test cancel reason");
  await page.type("#username", owner);
  await page.type("#password", password);
  await page.click('[type="submit"]');
};

//  SRT-7.113 Draft -> Canceled
exports.draftToCanceled = async (page, owner) => {
  await page.waitForSelector('[data-testid="item"] .MuiPaper-root [aria-label="Ellipses Menu"]');
  await page.click('[data-testid="item"] .MuiPaper-root [aria-label="Ellipses Menu"]');
  await page.waitForSelector('[role="menuitem"]');
  await page.click('[role="menuitem"]');
  await page.type('[placeholder="Insert reason here*"]', "Test cancel reason");
  await page.type("#username", owner);
  await page.type("#password", password);
  await page.click('[type="submit"]');
};

exports.createNewVersion = async (page) => {
  await page.click('[data-testid="item"] #create-new-rev');
  await page.waitForSelector('[data-testid="btn-yes"]');
  await page.click('[data-testid="btn-yes"]');
};

//  SRT-7.96 Draft -> Retirement Initiated
exports.draftToRetirementInitiated = async (page, owner, CO) => {
  await page.waitForSelector('[data-testid="item"] .MuiPaper-root [aria-label="Ellipses Menu"]');
  await page.click('[data-testid="item"] .MuiPaper-root [aria-label="Ellipses Menu"]');
  let [el] = await page.$x(`//li[contains(text(), "Retire")]`);
  await page.waitForTimeout(1000);
  await el.click();
  await page.click('[data-testid="btn-yes"]');
  await page.type('#reason-for-change', 'Test RfC');
  await page.type('#need-description', 'Test DoC');
  await page.click('#change-summary-submit');
  if (CO) {
    await page.click('#co-yes');
    await page.waitForSelector('#select-co-input');
    await page.click('#select-co-input');
    await page.click('#react-autowhatever-1 ul li:nth-last-child(1)');
    await page.click('#select-co-button');
  } else {
    await page.click('#co-no');
    await page.type(".MuiPaper-elevation1 #change-justify", "Test retirement no CO justifcation");
    await page.click("#justify-next");
  }
  await page.type('.MuiPaper-elevation1 #change-justify', 'Test retirement reason');
  await page.type('#username', owner);
  await page.type('#password', password);
  await page.click('[type="submit"]');
};

//  SRT-7.117 Retirement Initiated -> Retirement Canceled
exports.retirementInitiatedToRetirementCanceled = async (page, owner) => {
  await page.waitForSelector('[data-testid="item"] .MuiPaper-root [aria-label="Ellipses Menu"]');
  await page.click('[data-testid="item"] .MuiPaper-root [aria-label="Ellipses Menu"]');
  await page.click('[role="menu"]');
  await page.type("#username", owner);
  await page.type("#password", password);
  await page.click('[type="submit"]');
};

//  SRT-7.105 Retirement Initiated -> Retirement Rejected
exports.retirementInitiatedToRetirementRejected = async (page, approver) => {
  await page.waitForSelector('[data-testid="item"] #workflow-approvedDraft');
  await page.click('[data-testid="item"] #workflow-approvedDraft');
  await page.waitForSelector('[data-testid="btn-no"]');
  await page.click('[data-testid="btn-no"]');
  await page.type('[placeholder="Insert reason here*"]', "Test retirement rejection reason");
  await page.type('#username', approver);
  await page.type('#password', password);
  await page.click('[type="submit"]');
};

//  SRT-7.7 Retirement Rejected -> Draft 
exports.retirementRejectedToDraft = async (page) => {
  await page.waitForSelector('[data-testid="item"] #workflow-rejected');
  await page.click('[data-testid="item"] #workflow-rejected');
  await page.click('[type="submit"]');
};

 //  SRT-7.110 Retirement Initiated -> Approved Retirement
exports.retirementInitiatedToApprovedRetirement = async (page, approver) => {
  await page.waitForSelector('[data-testid="item"] #workflow-approvedDraft');
  await page.click('[data-testid="item"] #workflow-approvedDraft');
  await page.waitForSelector('[data-testid="btn-yes"]');
  await page.click('[data-testid="btn-yes"]');
  await page.click('[value=""]');
  await page.type("#username", approver);
  await page.type("#password", password);
  await page.click('[type="submit"]');
};

//  SRT-7.98 Retirement Initiated -> Retired
exports.retirementInitiatedToRetired = async (page, approver) => {
  await page.waitForSelector('[data-testid="item"] #workflow-obsolete');
  await page.click('[data-testid="item"] #workflow-obsolete');
  await page.waitForSelector('[data-testid="btn-yes"]');
  await page.click('[data-testid="btn-yes"]');
  await page.click('[value=""]');
  await page.type("#username", approver);
  await page.type("#password", password);
  await page.click('[type="submit"]');
};

//  SRT-64.2 Created -> In Progress
exports.createdToInProgress = async (page) => {
  await page.waitForSelector('#workflow-inProgress');
  await page.click('#workflow-inProgress');
  await page.click('#btn-yes');
};

//  SRT-64.3 In Progress -> Checked
exports.inProgressToChecked = async (page, approver) => {
  await page.waitForSelector('#workflow-checked');
  await page.click('#workflow-checked');
  await page.waitForSelector('[type="checkbox"]');
  await page.click('[type="checkbox"]');
  await page.type("#username", approver);
  await page.type("#password", password);
  await page.click('[type="submit"]');
};

//  SRT-64.5 Checked -> Void
exports.checkedToVoid = async (page, approver) => {
  await page.waitForSelector('[data-testid="item"] .MuiPaper-root [aria-label="Ellipses Menu"]');
  await page.click('[data-testid="item"] .MuiPaper-root [aria-label="Ellipses Menu"]');
  let [el] = await page.$x(`//li[contains(text(), "Void")]`);
  await page.waitForTimeout(1000);
  await el.click();
  await page.waitForSelector('#btn-yes');
  await page.click('#btn-yes');
  await page.type('[placeholder="Insert reason here*"]', "Test void reason");
  await page.type("#username", approver);
  await page.type("#password", password);
  await page.click('[type="submit"]');
};

//  SRT-64.4 Created, In Progress -> Cancel
//  SRT-57.4 Created, In Progress -> Cancel
exports.createdOrInProgressToCanceled = async (page, owner) => {
  await page.waitForSelector('[data-testid="item"] .MuiPaper-root [aria-label="Ellipses Menu"]');
  await page.click('[data-testid="item"] .MuiPaper-root [aria-label="Ellipses Menu"]');
  await page.waitForTimeout(1000);
  await page.waitForSelector('[role="menuitem"]');
  await page.click('[role="menuitem"]');
  await page.waitForSelector('#btn-yes');
  await page.click('#btn-yes');
  await page.waitForTimeout(1000);
  let el = await page.$('.MuiPaper-elevation1 #change-justify');
  await el.click();
  await el.type("Test cancel reason");
  await page.type("#username", owner);
  await page.type("#password", password);
  await page.click('[type="submit"]');
};
