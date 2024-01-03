import { run } from './index';
import * as core from '@actions/core';
import * as fs from 'fs';

jest.mock('@actions/core', () => ({
  ...jest.requireActual('@actions/core'),
  getInput: jest.fn(),
  setOutput: jest.fn(),
  setFailed: jest.fn(),
  info: jest.fn(),
}));
jest.mock('fs');

describe('run', () => {
  beforeEach(() => {
    (core.getInput as jest.Mock).mockClear();
    (core.setOutput as jest.Mock).mockClear();
    (core.setFailed as jest.Mock).mockClear();
    (fs.readFileSync as jest.Mock).mockClear();
  });

  it('should extract version changelog when version is found', async () => {
    (core.getInput as jest.Mock).mockImplementation((inputName) => {
      if (inputName === 'version_prefix') return '## Version ';
      if (inputName === 'version') return '1.4.0';
      if (inputName === 'changelog_path') return '/path/to/changelog.md';
    });
    (fs.readFileSync as jest.Mock).mockReturnValue('## Version 1.4.0\nChangelog content...\n## Version 1.3.0\n');

    await run();

    expect(core.setOutput).toHaveBeenCalledWith('changelog', 'Version: 1.4.0\nChangelog:\nChangelog content...');
  });


  it('should set failed status when version is not found', async () => {
    (core.getInput as jest.Mock).mockImplementation((inputName) => {
      if (inputName === 'version_prefix') return '## Version ';
      if (inputName === 'version') return '1.4.0';
      if (inputName === 'changelog_path') return '/path/to/changelog.md';
    });
    (fs.readFileSync as jest.Mock).mockReturnValue('## Version 1.3.0\nChangelog content...\n## Version 1.2.0\n');

    await run();

    expect(core.setFailed).toHaveBeenCalledWith('Version 1.4.0 not found in /path/to/changelog.md.');
  });

  it('should set failed status when an unknown error occurs', async () => {
    (core.getInput as jest.Mock).mockImplementation((inputName) => {
      if (inputName === 'version_prefix') return '## Version ';
      if (inputName === 'version') return '1.4.0';
      if (inputName === 'changelog_path') return '/path/to/changelog.md';
    });
    (fs.readFileSync as jest.Mock).mockImplementation(() => {
      throw new Error('Unknown error');
    });
    await run();

    expect(core.setFailed).toHaveBeenCalledWith('Unknown error');
  });
});