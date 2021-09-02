[![App Functional Tests](https://github.com/nor1c/gh-action-play/actions/workflows/tests.yml/badge.svg)](https://github.com/nor1c/gh-action-play/actions/workflows/tests.yml)

## [Skipping workflows](https://docs.github.com/en/actions/guides/about-continuous-integration#skipping-workflow-runs)
You can prevent a workflow from being triggered by adding skip instruction to commit message.<br>
If any commit message in your push or the HEAD commit of your PR contains the strings `[skip ci]`, `[ci skip]`, `[no ci]`, `[skip actions]`, or `[actions skip]` workflows triggered on the push or pull_request events will be skipped.
- example: `git commit -m "docs: add some documentation [skip ci]"`

<br>

## Caching dependencies to speed up workflows

### [About caching workflow dependencies](https://docs.github.com/en/actions/guides/caching-dependencies-to-speed-up-workflows#about-caching-workflow-dependencies)
Workflow runs often reuse the same outputs or downloaded dependencies from one run to another. For example, package and dependency management tools such as Maven, Gradle, npm, and Yarn keep a local cache of downloaded dependencies.
<br><br>
Jobs on GitHub-hosted runners start in a clean virtual environment and must download dependencies each time, causing increased network utilization, longer runtime, and increased cost. To help speed up the time it takes to recreate these files, GitHub can cache dependencies you frequently use in workflows.<br>
To cache dependencies for a job, you'll need to use GitHub's `cache` action. The action retrieves a cache identified by a unique key. For more information, see [actions/cache](https://github.com/actions/cache).
<br><br>
To cache and restore dependencies for npm, Yarn, or pnpm, you can use the `[actions/setup-node](https://github.com/actions/setup-node)` action.
<br>
#### Example caching npm dependencies:
```
steps:
- uses: actions/checkout@v2
- uses: actions/setup-node@v2
  with:
    node-version: '14'
    cache: 'npm'
- run: npm install
- run: npm test
```
<br>
#### [Example using the `cache` action](https://docs.github.com/en/actions/guides/caching-dependencies-to-speed-up-workflows#example-using-the-cache-action)
```
- name: Cache node modules
    uses: actions/cache@v2
    env:
      cache-name: cache-node-modules
    with:
      # npm cache files are stored in `~/.npm` on Linux/macOS
      path: ~/.npm
      key: ${{ runner.os }}-build-${{ env.cache-name }}-${{ hashFiles('**/package-lock.json') }}
      restore-keys: |
      ${{ runner.os }}-build-${{ env.cache-name }}-
      ${{ runner.os }}-build-
      ${{ runner.os }}-
```
<br>
**More information about caching**
- [Using contexts to create cache keys](https://docs.github.com/en/actions/guides/caching-dependencies-to-speed-up-workflows#using-contexts-to-create-cache-keys)
- [Matching a cache key](https://docs.github.com/en/actions/guides/caching-dependencies-to-speed-up-workflows#matching-a-cache-key)
- [Example of search priority](https://docs.github.com/en/actions/guides/caching-dependencies-to-speed-up-workflows#example-of-search-priority)

### Usage limits and eviction policy
GitHub will remove any cache entries that have not been accessed in over 7 days. There is no limit on the number of caches you can store, but the total size of all caches in a repository is limited to 5 GB. If you exceed this limit, GitHub will save your cache but will begin evicting caches until the total size is less than 5 GB.<br>

<br>

