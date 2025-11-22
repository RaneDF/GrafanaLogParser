# 📌 Grafana Log Parser – Tampermonkey Script

[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/RaneDF/GrafanaLogParser?sort=semver&logo=github)](https://github.com/RaneDF/GrafanaLogParser/releases/latest)
[![Build Status](https://img.shields.io/github/actions/workflow/status/RaneDF/GrafanaLogParser/release.yml?branch=main)](https://github.com/RaneDF/GrafanaLogParser/actions)

Transforms ugly VictoriaLogs / Grafana Explore JSON logs into **beautiful interactive log blocks** inside your browser.

---

## ✨ Features

- Pretty formatted JSON logs
- Collapsible stack traces
- Removes placeholder/empty Grafana rows
- Color-coded severities (ERROR/WARN/INFO/DEBUG)
- Filter logs by severity
- Click-to-copy metadata (traceId, spanId, logger, thread)
- Auto-updating through GitHub Releases
- Dark UI with modern layout

---

## 🚀 Installation (Tampermonkey)

Install or update the script:

👉 **https://github.com/RaneDF/GrafanaLogParser/releases/latest/download/grafana-log-parser.user.js**

Tampermonkey will automatically pull updates when new releases appear.

---

## 🛠 Development

Install dependencies:

```sh
npm install
