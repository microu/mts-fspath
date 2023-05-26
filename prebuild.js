#! /usr/bin/env -S node --no-warnings
//
// prebuild.js
//
import fs from "node:fs";
import pkg from "./package.json" assert { type: "json" };

console.log("pkg.version", pkg.version);

const versionFile = "src/version.ts";

let versionFileVersion = "";
try {
  const versionFileContent = fs.readFileSync(versionFile, "utf-8");
  console.log("VFC:", versionFileContent);
  const re = new RegExp('^export const VERSION = "([^"]*)"');
  const m = versionFileContent.match(re);
  console.log("M:", m[1]);
  if (m && m[1]) {
    versionFileVersion = m[1];
  }
} catch {}

if (versionFileVersion && versionFileVersion != pkg.version) {
  console.log(
    `Updating ${versionFile}: ${versionFileVersion} => ${pkg.version}`
  );
  fs.writeFileSync(versionFile, `export const VERSION = "${pkg.version}";\n`);
} else {
  console.log(`${versionFile} is up to date.`);
}
