/* eslint-disable no-console */
const argv = require("minimist")(process.argv.slice(2));
const cp = require("child_process");
const fs = require("fs");

const { coffee, jsBase } = argv;

const projectDir = "ios/lumenette";
const plist = `${projectDir}/Info.plist`;
const appDelegate = `${projectDir}/AppDelegate.m`;
const scheme = `ios/lumenette.xcodeproj/xcshareddata/xcschemes/lumenette.xcscheme`;
const projectFile = "ios/lumenette.xcodeproj/project.pbxproj";

const pjson = require("./../package.json");
const packageVersion = pjson.version;
const title = pjson["app-title"];
const env = pjson["app-env"];

const buildNumber = cp
  .execSync("git rev-list master --first-parent --count")
  .toString()
  .trim();

// UPDATE PLIST STUFF

const appName = env === "dev" ? "DEV" : title;
const bundleTitle = `${title}${env === "dev" ? "-dev" : ""}`
  .toLowerCase()
  .replace(/\s/g, "-");

cp.execSync(
  `/usr/libexec/PlistBuddy -c "Set :CFBundleDisplayName ${appName}" "${plist}"`
);

cp.execSync(
  `/usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString ${packageVersion}" "${plist}"`
);

cp.execSync(
  `/usr/libexec/PlistBuddy -c "Set :CFBundleVersion ${buildNumber}" "${plist}"`
);

if (env === "prod") {
  try {
    cp.execSync(
      `/usr/libexec/PlistBuddy -c "Delete :NSAppTransportSecurity" "${plist}"`
    );
  } catch (e) {
    // already deleted
  }
} else {
  try {
    cp.execSync(
      `/usr/libexec/PlistBuddy -c "Add :NSAppTransportSecurity:NSExceptionDomains:localhost:NSExceptionAllowsInsecureHTTPLoads bool true" "${plist}"`
    );
  } catch (e) {
    // already added
  }
}

// UPDATE JS LOCATION STUFF

let jsCodeLocation;
if (env === "prod") {
  jsCodeLocation =
    'jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];';
} else if (env === "dev") {
  if (coffee) {
    if (!jsBase) {
      throw new Error("cant work in a coffee shop without proxy...");
    }

    jsCodeLocation = `jsCodeLocation = [NSURL URLWithString:@"${jsBase}/index.bundle?dev=true&platform=ios"];`;
  } else {
    jsCodeLocation =
      'jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];';
  }
}

fs.writeFileSync(
  appDelegate,
  fs
    .readFileSync(appDelegate, "utf8")
    .replace(/jsCodeLocation\s=\s.*;/g, jsCodeLocation),
  "utf8"
);

// UPDATE SCHEME STUFF

const devScheme = `<LaunchAction
      buildConfiguration = "Debug"`;

const prodScheme = `<LaunchAction
      buildConfiguration = "Release"`;

fs.writeFileSync(
  scheme,
  fs
    .readFileSync(scheme, "utf8")
    .replace(
      env === "prod" ? devScheme : prodScheme,
      env === "prod" ? prodScheme : devScheme
    ),
  "utf8"
);

// UPDATE PROJECT FILE

const bundleId = `PRODUCT_BUNDLE_IDENTIFIER = "com.${bundleTitle}.app";`;

fs.writeFileSync(
  projectFile,
  fs
    .readFileSync(projectFile, "utf8")
    .replace(/PRODUCT_BUNDLE_IDENTIFIER\s=.*\.app"?;/g, bundleId),
  "utf8"
);

if (env === "prod") {
  console.log(
    "Now open XCode, build, Product > Archive, and upload to App Store."
  );
} else {
  console.log("Now develop...");
}
