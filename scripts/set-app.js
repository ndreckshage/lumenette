const argv = require('minimist')(process.argv.slice(2));
const cp = require('child_process');
const path = require('path');
const fs = require('fs');

const app = argv._[0];

const APP_MAIN = 'Lumenette';
const APP_BTC = 'Lumenette BTC';

switch (app) {
  case APP_MAIN:
  case APP_BTC:
    break;
  default:
    throw new Error(`bad app ${app}`);
}

const pjson = path.resolve(process.cwd(), 'package.json');
fs.writeFileSync(
  pjson,
  fs
    .readFileSync(pjson, 'utf8')
    .replace(/"app-title":\s.*,/g, `"app-title": "${app}",`),
  'utf8'
);

const setEnv = path.resolve(__dirname, 'set-env.js');
fs.writeFileSync(
  setEnv,
  fs
    .readFileSync(setEnv, 'utf8')
    .replace(/const\sAPP\s.*;/g, `const APP = '${app}';`),
  'utf8'
);

cp.execSync(`node ./scripts/sync-ios`, {stdio: [0, 1, 2]});
cp.execSync(`node ./scripts/sync-android`, {stdio: [0, 1, 2]});
