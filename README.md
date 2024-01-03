
# Changelog Version Extractor

This GitHub Action extracts a specific version's changelog from a CHANGELOG file. It's designed to help automate the process of fetching release notes or changelog entries for a given version, which can be particularly useful for generating release summaries, notifications, or other workflow automation tasks.

## Inputs

### `version_prefix`

**Required** The prefix used to identify the version section in the CHANGELOG.

Example: `"## Version "`

### `version`

**Required** The specific version to extract from the CHANGELOG.

Example: `"1.4.0"`

### `changelog_path`

**Optional** Path to the CHANGELOG file.

Default: `"./CHANGELOG.md"`

## Outputs

### `changelog`

The extracted changelog section for the specified version.

## Usage

To use this action, add it as a step in your workflow. Here is a basic example:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Extract Changelog
      id: changelog
      uses: nickohold/changelog-version-extractor@v1.0.0
      with:
        version_prefix: "## Version "
        version: "1.4.0"
        changelog_path: "./CHANGELOG.md"

    # Use the output from the `changelog` step
    - name: Get the output
      run: echo "The Changelog is ${{ steps.changelog.outputs.changelog }}"
```

## Contributing

Contributions to this project are welcome! Please consider the following guidelines:

- Submit issues for any feature requests, bugs, or documentation improvements.
- When submitting a pull request, please make sure your changes are well-documented and include appropriate test cases.

## License

This project is licensed under the [MIT License](LICENSE).
