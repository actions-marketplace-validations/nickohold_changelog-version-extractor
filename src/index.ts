import * as core from '@actions/core';
import * as fs from 'fs';
import * as path from 'path';

const VERSION_PREFIX_INPUT: string = 'version_prefix';
const VERSION_INPUT: string = 'version';
const CHANGELOG_PATH_INPUT: string = 'changelog_path';
const ENCODE_FOR_SLACK: string = 'encode_for_slack';
const DEFAULT_CHANGELOG_FILENAME: string = 'CHANGELOG';
const MARKDOWN_EXTENSION: string = '.md';

export async function run(): Promise<void> {
  try {
    const versionPrefix: string = core.getInput(VERSION_PREFIX_INPUT, { required: true });
    const version: string = core.getInput(VERSION_INPUT, { required: true });
    const encodeForSlack: boolean = core.getInput(ENCODE_FOR_SLACK) === 'true';
    let changelogPath: string = core.getInput(CHANGELOG_PATH_INPUT);
    if (!changelogPath) {
      changelogPath = findChangelogFilePath();
    }

    const changelogContent = fs.readFileSync(changelogPath, 'utf8');
    const versionChangelog = extractChangelogForVersion(changelogContent, versionPrefix, version, encodeForSlack);

    core.info(`Changelog content: ${versionChangelog}`)
    if (versionChangelog) {
      core.setOutput('changelog', versionChangelog);
    } else {
      core.setFailed(`Version ${version} not found in ${changelogPath}.`);
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('Unknown error occurred');
    }
  }
}

function findChangelogFilePath(): string {
  const possibleFilenames = [`${DEFAULT_CHANGELOG_FILENAME}${MARKDOWN_EXTENSION}`, DEFAULT_CHANGELOG_FILENAME];
  for (const filename of possibleFilenames) {
    if (fs.existsSync(filename)) {
      return filename;
    }
  }
  throw new Error(`The default changelog file '${DEFAULT_CHANGELOG_FILENAME}' with or without '${MARKDOWN_EXTENSION}' extension was not found.`);
}

function extractChangelogForVersion(changelogContent: string, versionPrefix: string, version: string, encodeForSlack: boolean): string {
  const lines = changelogContent.split('\n');
  let versionIndex = lines.findIndex(line => line.startsWith(versionPrefix) && line.includes(version));

  if (versionIndex === -1) {
    return '';
  }

  let changelog = '';
  versionIndex++; // Start reading lines after the version line.

  while (versionIndex < lines.length && !lines[versionIndex].startsWith(versionPrefix)) {
    changelog += lines[versionIndex] + '\n';
    versionIndex++;
  }
 changelog = changelog.trim();
  if (encodeForSlack) {
    let formatted = changelog.replace(/\n/g, '\\n')
      .replace(/"/g, '\\"')
      .replace(/%0A/g, '\\n');
    changelog = `Version: ${version}\\nChangelog:\\n${formatted}`
  }
  return changelog;
}

run();
