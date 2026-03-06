# Grafana Log Parser

Transform raw VictoriaLogs / Grafana Explore JSON logs into clean, readable log blocks directly in the browser.

[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/RaneDF/GrafanaLogParser?sort=semver)](https://github.com/RaneDF/GrafanaLogParser/releases)
[![Build](https://img.shields.io/github/actions/workflow/status/RaneDF/GrafanaLogParser/release.yml)](https://github.com/RaneDF/GrafanaLogParser/actions)

### [Install the latest version](https://github.com/RaneDF/GrafanaLogParser/releases/latest/download/grafana-log-parser.user.js)

That link is the main entry point for users.

### First time?
1. Install **Tampermonkey** in your browser
2. Click **Install the latest version**
3. Confirm installation in Tampermonkey
4. Open Grafana logs

Tampermonkey will keep the script updated from GitHub Releases.

---

## What it does

- Pretty-prints raw JSON log entries
- Formats embedded JSON inside log messages
- Formats Java/Kotlin-style object dumps inside messages
- Shows structured metadata blocks
- Makes stack traces collapsible
- Adds severity colors for `ERROR`, `WARN`, `INFO`, `DEBUG`
- Adds quick level filters
- Makes `traceId` clickable
- Lets you copy metadata values quickly

---

## Supported log styles

### Structured JSON logs
```json
{"timestamp":"2026-03-07T00:15:03.720+05","level":"INFO","message":"..."}