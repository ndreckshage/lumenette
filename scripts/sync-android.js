const fs = require("fs");
const path = require("path");

const vendorBundle = "stellar-interop-bundle.js";

const componentPath = path.resolve(
  process.cwd(),
  "app",
  "components",
  "stellar",
  "vendor",
  vendorBundle
);

const androidPath = path.resolve(
  process.cwd(),
  "android",
  "app",
  "src",
  "main",
  "assets",
  vendorBundle
);

fs.copyFileSync(componentPath, androidPath);
