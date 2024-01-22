const fs = require('fs');

const xmldoc = require('xmldoc');

const REQUIRE_MORE_THAN_90_PERCENT_COVERAGE = [
  // Wallet
  'duelme-app.src.components.Wallet',
  'duelme-app.src.features.Wallet',
  // Deposit
  'duelme-app.src.components.ModalContainer.modals.Deposit',
  'duelme-app.src.components.ModalContainer.modals.Deposit.components',
  // Withdraw
  'duelme-app.src.components.ModalContainer.modals.Withdraw',
  'duelme-app.src.components.ModalContainer.modals.Withdraw.components',
  // Login
  'duelme-app.src.features.Login',
  'duelme-app.src.features.Login.components',
  // MatchView
  'duelme-app.src.features.MatchView',
  'duelme-app.src.features.MatchView.components',
  'duelme-app.src.features.WinnerScreen',
  'duelme-app.src.features.WinnerScreen.components',

  // Matchmaking
  'duelme-app.src.features.Matchmaking',
  'duelme-app.src.features.OpponentFound',
  'duelme-app.src.features.GameMode',
  'duelme-app.src.features.GameMode.component',
  'duelme-app.src.features.SearchOpponent',

  // Score related
  'duelme-app.src.components.ModalContainer.modals.ReportMatchScore',
  'duelme-app.src.components.ModalContainer.modals.ViewScores',

  // Issues related
  'duelme-app.src.components.ModalContainer.modals.ReportMatchIssue',
  'duelme-app.src.components.ModalContainer.modals.ViewIssues',
];

const contentXML = fs.readFileSync('./coverage/clover.xml');

const xmlDocument = new xmldoc.XmlDocument(contentXML.toString());

let raiseError = false;

for (let moduleName of REQUIRE_MORE_THAN_90_PERCENT_COVERAGE) {
  const moduleObject = xmlDocument.children[1].childWithAttribute('name', moduleName);
  let metrics = moduleObject.children[1].attr;
  const coveredPercentage = (metrics.coveredstatements * 100) / metrics.statements;
  if (coveredPercentage < 90) {
    raiseError = true;
    // eslint-disable-next-line
    console.log(`\x1b[31m ${moduleName}: \x1b[0m${coveredPercentage.toFixed(2)}%`);
  } else {
    // eslint-disable-next-line
    console.log(`\x1b[32m ${moduleName}: \x1b[0m${coveredPercentage.toFixed(2)}%`);
  }
}

if (raiseError && !process.env.AVOID_COVERAGE_ERROR) {
  throw 'Coverage error';
}
