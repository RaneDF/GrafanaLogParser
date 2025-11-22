import { readFileSync } from "fs";
import { resolve } from "path";

const pkgPath = resolve("./package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));

export default `// ==UserScript==
// @name         Grafana Log Beautifier
// @namespace    https://github.com/RaneDF
// @version      ${pkg.version}
// @description  Pretty logs
// @author       Farrukh Iskandarov
// @match        https://dev-logs.*/*
// @match        file:///*
// @grant        none
// ==/UserScript==
`;
