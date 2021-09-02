<p align="center">
    [![App Functional Tests](https://github.com/nor1c/gh-action-play/actions/workflows/tests.yml/badge.svg)](https://github.com/nor1c/gh-action-play/actions/workflows/tests.yml)
</p>

### Skipping workflows
You can prevent a workflow from being triggered by adding skip instruction to commit message.<br>
If any commit message in your push or the HEAD commit of your PR contains the strings `[skip ci]`, `[ci skip]`, `[no ci]`, `[skip actions]`, or `[actions skip]` workflows triggered on the push or pull_request events will be skipped.
- example: `git commit -m "docs: add some documentation [skip ci]"`