"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const fs = __importStar(require("fs"));
const VERSION_PREFIX_INPUT = 'version_prefix';
const VERSION_INPUT = 'version';
const CHANGELOG_PATH_INPUT = 'changelog_path';
const DEFAULT_CHANGELOG_FILENAME = 'CHANGELOG';
const MARKDOWN_EXTENSION = '.md';
async function run() {
    try {
        // const versionPrefix: string = core.getInput(VERSION_PREFIX_INPUT, { required: true });
        // const version: string = core.getInput(VERSION_INPUT, { required: true });
        // let changelogPath: string = core.getInput(CHANGELOG_PATH_INPUT);
        const versionPrefix = '## Version';
        const version = '1.4.0';
        let changelogPath = '/Users/nick.holden/GitHub/automation-conductor/CHANGELOG.md';
        if (!changelogPath) {
            changelogPath = findChangelogFilePath();
        }
        const changelogContent = fs.readFileSync(changelogPath, 'utf8');
        core.info(`Changelog content:\n${changelogContent}`);
        const versionChangelog = extractChangelogForVersion(changelogContent, versionPrefix, version);
        if (versionChangelog) {
            core.setOutput('changelog', `Version: ${version}\nChangelog:\n${versionChangelog}`);
        }
        else {
            core.setFailed(`Version ${version} not found in ${changelogPath}.`);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
        else {
            core.setFailed('Unknown error occurred');
        }
    }
}
function findChangelogFilePath() {
    const possibleFilenames = [`${DEFAULT_CHANGELOG_FILENAME}${MARKDOWN_EXTENSION}`, DEFAULT_CHANGELOG_FILENAME];
    for (const filename of possibleFilenames) {
        if (fs.existsSync(filename)) {
            return filename;
        }
    }
    throw new Error(`The default changelog file '${DEFAULT_CHANGELOG_FILENAME}' with or without '${MARKDOWN_EXTENSION}' extension was not found.`);
}
function extractChangelogForVersion(changelogContent, versionPrefix, version) {
    const lines = changelogContent.split('\n');
    let versionIndex = lines.findIndex(line => line.startsWith(versionPrefix) && line.includes(version));
    if (versionIndex === -1) {
        return null;
    }
    let changelog = '';
    versionIndex++; // Start reading lines after the version line.
    while (versionIndex < lines.length && !lines[versionIndex].startsWith(versionPrefix)) {
        changelog += lines[versionIndex] + '\n';
        versionIndex++;
    }
    return changelog.trim();
}
run();
console.log(`Changelog output: ${process.env['changelog']}`);
//# sourceMappingURL=index.js.map