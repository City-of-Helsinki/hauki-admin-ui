This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Hauki Admin UI
UI for managing opening hours in Hauki.

## DEVELOPMENT

### Prerequisites
- Node 12.x
- Yarn
- Git
- Docker
- Running [Hauki API](https://github.com/City-of-Helsinki/hauki)

**Notice!** To run the client locally with API, the client needs a set of required query parameters in the URL.
The query parameters can be generated by using node-script scripts/generate-query-parameters.
- HAUKI_KEY - an env key of API, this can be obtained from [hauki-api-repo](https://github.com/City-of-Helsinki/hauki)
- HAUKI_USER - username string, this can be obtained form hauki-api
- HAUKI_ORGANIZATION and HAUKI_RESOURCE - ids of organization and resource, the combination of these can be obtained from hauki-api too.

It is also possible to configure API's URL by setting env variable API_URL, for example, `API_URL=http://localhost:9000 yarn start`. The default is http://localhost:8080

### Running locally in dev mode

1. Export required environment variables: 
    ```shell 
    export HAUKI_KEY=<HAUKI_KEY> HAUKI_USER=<HAUKI_USER> HAUKI_ORGANIZATION=<HAUKI_ORGANIZATION> HAUKI_RESOURCE=<HAUKI_RESOURCE>
    ```
2. Generate query-parameters: 
   ```shell 
   node scripts/generate-auth-params.js
   ```
3. Copy generated query-parameters to clipboard.  
4. Start dev server:
   ```shell
   yarn start
   ```
5. Visit localhost:
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


## RELEASE

### Release to Test environment

Release to test environment https://hauki-admin-ui.dev.hel.ninja is handled automatically from master branch. Updates to master branch triggers
azure pipeline that will run tests, build and push image to dockerhub, and finally release it to test environment hosted by red hat openshift.
Currently azure-pipeline is configured directly from version control, but red hat openshift configuration resides in openshift cluster.


## OTHER AVAILABLE SCRIPTS

In the project directory, you can run:

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn test-cypress`

Runs cypress (e2e) tests locally.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
