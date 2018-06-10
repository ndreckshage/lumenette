/* eslint-disable no-console */
const argv = require('minimist')(process.argv.slice(2));
const cp = require('child_process');

const {api, js} = argv;

if (!api || !js) {
  console.log(
    'Must supply ngrok base.',
    'yarn setup-coffee-shop --api=c3f6928c --js=5799076d'
  );

  process.exit(0);
}

const ngrok = 'ngrok.io';
const apiArg = `--apiBase=https://${api}.${ngrok}`;
const jsArg = `--jsBase=https://${js}.${ngrok}`;
cp.execSync(`yarn set-env dev --coffee ${apiArg}`, {stdio: [0, 1, 2]});
cp.execSync(`node ./scripts/sync-ios dev --coffee ${jsArg}`, {
  stdio: [0, 1, 2]
});

console.log(
  'now `yarn start` and run from xcode',
  'NOTE: remote debugging doesnt work'
);
