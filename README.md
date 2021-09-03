[![App Functional Tests](https://github.com/nor1c/gh-action-play/actions/workflows/tests.yml/badge.svg)](https://github.com/nor1c/gh-action-play/actions/workflows/tests.yml)
<br><br>

> **Basic tutorial to GitHub Action**: [Fully Automated npm publish using GitHub Actions and Semantic Release
](https://www.youtube.com/watch?v=QZdY4XYbqLI&ab_channel=BrunoAntunes) by [Bruno Antunes](https://www.youtube.com/channel/UCyU0mNYdX9EHY7rc5yucIZA)
<br>

## # [Events](https://docs.github.com/en/actions/reference/events-that-trigger-workflows)
You can configure your workflows to run when specific activity on GitHub happens, at a scheduled time, or when an event outside of GitHub occurs.

### ## [Scheduled Events](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#scheduled-events)
The `schedule` event allows you to trigger a workflow at a scheduled time.

<img src="https://raw.githubusercontent.com/nor1c/gh-action-play/main/doc_assets/gh-action-schedule.png">

**Example syntax**
```
on:
  schedule:
    # * is a special character in YAML so you have to quote this string
    - cron:  '30 5,17 * * *'
```

Cron syntax has five fields separated by a space, and each field represents a unit of time.
```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of the month (1 - 31)
│ │ │ ┌───────────── month (1 - 12 or JAN-DEC)
│ │ │ │ ┌───────────── day of the week (0 - 6 or SUN-SAT)
│ │ │ │ │                                   
│ │ │ │ │
│ │ │ │ │
* * * * *
```

You can use these operators in any of the five fields:
<img src="https://raw.githubusercontent.com/nor1c/gh-action-play/main/doc_assets/gh-cron.png" />

### # [Manual events](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#manual-events)
You can manually trigger workflow runs. To trigger specific workflows in a repository, use the `workflow_dispatch` event. To trigger more than one workflow in a repository and create custom events and event types, use the `repository_dispatch` event.

*Read more about `Manual Events`: [Manually running a workflow](https://docs.github.com/en/actions/managing-workflow-runs/manually-running-a-workflow)

## # [Skipping workflows](https://docs.github.com/en/actions/guides/about-continuous-integration#skipping-workflow-runs)
You can prevent a workflow from being triggered by adding skip instruction to commit message.<br>
If any commit message in your push or the HEAD commit of your PR contains the strings `[skip ci]`, `[ci skip]`, `[no ci]`, `[skip actions]`, or `[actions skip]` workflows triggered on the push or pull_request events will be skipped.

example: `git commit -m "docs: add some documentation [skip ci]"`

<br>

## # [Caching dependencies to speed up workflows](https://docs.github.com/en/actions/guides/caching-dependencies-to-speed-up-workflows)
### ## [About caching workflow dependencies](https://docs.github.com/en/actions/guides/caching-dependencies-to-speed-up-workflows#about-caching-workflow-dependencies)
Workflow runs often reuse the same outputs or downloaded dependencies from one run to another. For example, package and dependency management tools such as Maven, Gradle, npm, and Yarn keep a local cache of downloaded dependencies.

Jobs on GitHub-hosted runners start in a clean virtual environment and must download dependencies each time, causing increased network utilization, longer runtime, and increased cost. To help speed up the time it takes to recreate these files, GitHub can cache dependencies you frequently use in workflows.

To cache dependencies for a job, you'll need to use GitHub's `cache` action. The action retrieves a cache identified by a unique key. For more information, see [`actions/cache`](https://github.com/actions/cache).

To cache and restore dependencies for npm, Yarn, or pnpm, you can use the [`actions/setup-node`](https://github.com/actions/setup-node) action.
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

**More information about caching**
- [Using contexts to create cache keys](https://docs.github.com/en/actions/guides/caching-dependencies-to-speed-up-workflows#using-contexts-to-create-cache-keys)
- [Matching a cache key](https://docs.github.com/en/actions/guides/caching-dependencies-to-speed-up-workflows#matching-a-cache-key)
- [Example of search priority](https://docs.github.com/en/actions/guides/caching-dependencies-to-speed-up-workflows#example-of-search-priority)

### ## Usage limits and eviction policy
GitHub will remove any cache entries that have not been accessed in over 7 days. There is no limit on the number of caches you can store, but the total size of all caches in a repository is limited to 5 GB. If you exceed this limit, GitHub will save your cache but will begin evicting caches until the total size is less than 5 GB.<br>

<br>

## # [About service containers](https://docs.github.com/en/actions/guides/about-service-containers)

### ## [About service containers](https://docs.github.com/en/actions/guides/about-service-containers#about-service-containers)
Service containers are Docker containers that provide a simple and portable way for you to host services that you might need to test or operate your application in a workflow. For example, your workflow might need to run integration tests that require access to a database and memory cache.

You can configure service containers for each job in a workflow. GitHub creates a fresh Docker container for each service configured in the workflow, and destroys the service container when the job completes. Steps in a job can communicate with all service containers that are part of the same job.

> Note: If your workflows use Docker container actions or service containers, then you must use a Linux runner:
> - If you are using GitHub-hosted runners, you must use an Ubuntu runner.
> - If you are using self-hosted runners, you must use a Linux machine as your runner and Docker must be installed. 

### ## [Creating service containers](https://docs.github.com/en/actions/guides/about-service-containers#creating-service-containers)
You can use the `services` keyword to create service containers that are part of a job in your workflow. For more information, see [`jobs.<job_id>.services`](https://docs.github.com/en/actions/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions#jobsjob_idservices).

This example creates a service called `redis` in a job called `container-job`. The Docker host in this example is the `node:10.18-jessie` container.
```
name: Redis container example
on: push

jobs:
  # Label of the container job
  container-job:
    # Containers must run in Linux based operating systems
    runs-on: ubuntu-latest
    # Docker Hub image that `container-job` executes in
    container: node:10.18-jessie

    # Service containers to run with `container-job`
    services:
      # Label used to access the service container
      redis:
        # Docker Hub image
        image: redis
```

#### [Example mapping Redis ports](https://docs.github.com/en/actions/guides/about-service-containers#example-mapping-redis-ports)
This example maps the service container redis port `6379` to the Docker host port `6379`.
```
name: Redis Service Example
on: push

jobs:
  # Label of the container job
  runner-job:
    # You must use a Linux environment when using service containers or container jobs
    runs-on: ubuntu-latest

    # Service containers to run with `runner-job`
    services:
      # Label used to access the service container
      redis:
        # Docker Hub image
        image: redis
        #
        ports:
          # Opens tcp port 6379 on the host and service container
          - 6379:6379
```

**Examples**
- [Creating Redis service containers](https://docs.github.com/en/actions/guides/creating-redis-service-containers)
- [Creating PostgreSQL service containers](https://docs.github.com/en/actions/guides/creating-postgresql-service-containers)

<br>

## # Debugging action locally
You can run GitHub action locally with [`necktos/act`](https://github.com/nektos/act)

Run your GitHub Actions locally! Why would you want to do this? Two reasons:
- **Fast Feedback** - Rather than having to commit/push every time you want to test out the changes you are making to your `.github/workflows/` files (or for any changes to embedded GitHub actions), you can use `act` to run the actions locally. The environment variables and filesystem are all configured to match what GitHub provides.
- **Local Task Runner** - I love make. However, I also hate repeating myself. With act, you can use the GitHub Actions defined in your `.github/workflows/` to replace your `Makefile!`
