import fs from 'node:fs';
import path from 'node:path';

const packageJsonPath = path.resolve(process.cwd(), 'package.json');
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const banner = `
// ==UserScript==
// @name         Grafana Log Beautifier
// @namespace    https://github.com/RaneDF/GrafanaLogParser
// @version      ${pkg.version}
// @description  Pretty logs for Grafana JSON logs
// @author       Farrukh Iskandarov
// @match        *://*/d/*
// @match        *://*/explore*
// @match        *://*/a/*
// @grant        none
// @run-at       document-idle
// @downloadURL  https://github.com/RaneDF/GrafanaLogParser/releases/latest/download/grafana-log-parser.user.js
// @updateURL    https://github.com/RaneDF/GrafanaLogParser/releases/latest/download/grafana-log-parser.user.js
// ==/UserScript==
`.trim();

export default banner;