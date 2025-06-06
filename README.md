This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Hauki Admin UI

UI for managing opening hours in Hauki.

## DEVELOPMENT

### Prerequisites

- Node 22.x (`nvm use`)
- Yarn
- Git
- Docker
- Running [Hauki API](https://github.com/City-of-Helsinki/hauki)

**Notice!** To run the client locally with API, the client needs a set of required query parameters in the URL.
The query parameters can be generated by using node-script scripts/generate-query-parameters.

- HAUKI_KEY - an env key of API, this can be obtained from hauki-api
- HAUKI_USER - username string, this can be obtained form hauki-api
- HAUKI_ORGANIZATION and HAUKI_RESOURCE - ids of organization and resource, the combination of these can be obtained from hauki-api too.

It is also possible to configure API's URL by setting env variable API_URL, for example, `API_URL=http://localhost:9000 yarn start`. The default is <http://localhost:8000>

### Running locally in dev mode

1. Export required environment variables:

    ```shell
    export HAUKI_KEY=<HAUKI_KEY> HAUKI_USER=<HAUKI_USER> HAUKI_ORGANIZATION=<HAUKI_ORGANIZATION> HAUKI_RESOURCE=<HAUKI_RESOURCE> HAUKI_SOURCE=<HAUKI_SOURCE>
    ```

2. Install dependencies:

   ```shell
   yarn
   ```

3. Start dev server:

   ```shell
   yarn start
   ```

4. Visit localhost:

   ```shell
   ./scripts/open_local.sh
   ```

Alternatively

4. Generate query-parameters:

   ```shell
   node scripts/generate-auth-params.mjs
   ```

5. Copy generated query-parameters to clipboard.

6. Visit localhost:

   ```
   http://localhost:3000/resource/<HAUKI_RESOURCE>?<paste generated query parameters here>
   ```

### Running service in Docker

#### How to build a docker image

```bash
docker build . -t hauki-admin-ui
```

#### How to run the docker image

```bash
docker run -p 3000:8000 -e API_URL=<api-url-here> -e USE_AXE=<true|false> hauki-admin-ui
```

## Commit message format

New commit messages must adhere to the [Conventional Commits](https://www.conventionalcommits.org/)
specification, and line length is limited to 72 characters.

[commitlint](https://github.com/conventional-changelog/commitlint) checks every new commit for the correct format.


## RELEASE

### Publish to Dev environment

#### Review environment

New commit to PR will trigger review pipeline. Review pipeline builds application and deploys a dynamic environment to the Openshift dev. The review environment can be used to verify PR.

#### Dev environment

Release to dev environment <https://hauki-admin-ui.dev.hel.ninja> is handled automatically from main branch. Updates to main branch triggers
azure pipeline that will run tests, build and deploy to dev environment hosted by red hat openshift.
Currently azure-pipeline is configured directly from version control, but red hat openshift configuration resides in openshift cluster.

### Release to Test, Stage and Production environments

Release is done by [release-please](https://helsinkisolutionoffice.atlassian.net/wiki/spaces/DD/pages/8278966368/Releases+with+release-please).
It creates release PR based on commits messages. Merge of the PR will trigger a release pipeline that build and deploys to stage and test environments automatically.

Release-please update the package.json version number automatically and it is included to release PR.

#### Publish to production environments
Publishing to production requires manual approval in the DevOps release pipeline.

## OTHER AVAILABLE SCRIPTS

In the project directory, you can run:

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [writing tests](https://vitest.dev/guide/#writing-tests) for more information.

### `test:e2e:start`

Runs Playwright (e2e) tests locally. Requires the same set of HAUKI env variables as running service locally.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [building for production](https://vitejs.dev/guide/build) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Vite guide](https://vitejs.dev/guide/).

To learn React, check out the [React documentation](https://reactjs.org/).

# Known issues

## Type instantiation is excessively deep and possibly infinite

At the times the compilation might fail to the following error while
running the development server locally causing the developer to restart
the server whenever the error occurs and slows down the development.

```
Type instantiation is excessively deep and possibly infinite
```

This started to occur after upgrading `react-hook-form` from v6 to v7.
The current react-hook-form and TypeScript versions are locked because of this
to mitigate the issue.

More info about the issue can be found here:
<https://github.com/react-hook-form/react-hook-form/issues/6679>

According to to the previous discussion to discharge the issue consider upgrading to `react-hook-form` v8.
