const {join} = require('path');

const program = require('commander');

const {publish} = require('./helper');

program
  .description('Publish Android App Bundle to Google Play')
  .requiredOption('-k, --keyFile <path>', 'Set google api json key file')
  .requiredOption('-p, --packageName <name>', 'Set package name (com.some.app)')
  .requiredOption('-a, --aabFile <path>', 'Set path to .aab file')
  .requiredOption('-t, --track <track>', 'Set track (production, beta, alpha...)')
  .option('-e, --exit', 'Exit on error with error code 1.')
  .parse();

publish({
  keyFile: join(process.cwd(), program._optionValues.keyFile),
  packageName: program._optionValues.packageName,
  aabFile: join(process.cwd(), program._optionValues.aabFile),
  track: program._optionValues.track,
})
  .then(() => {
    // eslint-disable-next-line
    console.log('Publish complete.');
  })
  .catch(error => {
    // eslint-disable-next-line
    console.error('API error:', error.message);
    process.exit(program.exit ? 1 : 0);
  });
