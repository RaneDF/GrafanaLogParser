const fs = require("fs-extra");
const path = require("path");
const sha256 = require("js-sha256").sha256;
const uglify = require("uglify-js");

const SRC = path.join(__dirname, "..", "src");
const BUILD = path.join(__dirname, "..", "build");

(async () => {
    await fs.ensureDir(BUILD);

    const pkg = JSON.parse(await fs.readFile("package.json", "utf8"));
    const version = pkg.version;

    // Prepare header
    const headerFactory = require(path.join(SRC, "header.js"));
    const header = headerFactory(version);

    // Load modules as text (native ES modules)
    const modules = [
        "config.js",
        "styles.js",
        "utils.js",
        "remover.js",
        "formatter.js",
        "toolbar.js",
        "scanner.js",
        "main.js"
    ].map(name => fs.readFileSync(path.join(SRC, name), "utf8"));

    let bundle = `${header}\n(function(){\n${modules.join("\n\n")}\n})();`;

    // Minify
    const min = uglify.minify(bundle, { compress: true, mangle: false });
    const finalScript = min.code || bundle;

    // Compute checksum
    const checksum = sha256(finalScript);
    const checksumBanner = `// SHA-256: ${checksum}\n`;

    const dist = checksumBanner + finalScript;

    const outPath = path.join(BUILD, "grafana-log-parser.user.js");
    fs.writeFileSync(outPath, dist, "utf8");

    console.log(`✔ Built grafana-log-parser.user.js (v${version})`);
    console.log(`✔ SHA256: ${checksum}`);
})();
