const argv = require('minimist')(process.argv.slice(2));
const cp = require('child_process');
const path = require('path');
const fs = require('fs');

const env = argv._[0];
const {coffee, apiBase} = argv;

if (coffee && !apiBase) {
  throw new Error('cannot run in a coffee shop without an external api!');
}

const pjson = path.resolve(process.cwd(), 'package.json');
fs.writeFileSync(
  pjson,
  fs
    .readFileSync(pjson, 'utf8')
    .replace(/"app-env":\s.*,/g, `"app-env": "${env}",`),
  'utf8'
);

const writeTo = env === 'dev' ? '.env' : '.env.production';

// @NOTE this gets overwritten in set-app, dont touch
const APP = 'Lumenette';

const config = (() => {
  switch (env) {
    case 'prod':
      return `
APP=${APP}
STELLAR_NETWORK=PROD
API_BASE=https://api.lumenette.com
USE_SENTRY=true
USE_CONSOLE=false
DEV_MENU_OPENER=false
`;

    default:
      return `
    APP=${APP}
    STELLAR_NETWORK=DEV
    API_BASE=${apiBase || 'http://10.0.0.69:4000'}
    USE_SENTRY=false
    USE_CONSOLE=true
    DEV_MENU_OPENER=true
        `;
  }
})();

fs.writeFileSync(writeTo, config, 'utf8');
cp.execSync(`node ./scripts/sync-ios`, {stdio: [0, 1, 2]});
cp.execSync(`node ./scripts/sync-android`, {stdio: [0, 1, 2]});
