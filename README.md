# Duelme App (React native)

## Development

### Requirements

You are gonna need the following software installed in your machine

Node v12.18.3
JDK 11
Android Studio with emulator or Xcode

### Environment variables

You are gonna need to following environment variables

`export APISDK_NPM_TOKEN=<your personal access token>`
`export FONTAWESOME_NPM_AUTH_TOKEN=99CD303F-5160-4704-AB05-45650BBB75A6`

### The .env file

You are gonna need to fill the following environment variables to point to QA (You can customize it to point to your local BE environment)

```
REACT_APP_RECAPTCHA_SITE_KEY=<recaptcha site key> // This is not being used?
REACT_APP_RECAPTCHA_URL=<recaptcha url> // This is not being used?
REACT_APP_COGNITO_APP_REGION=<cognito region>
REACT_APP_COGNITO_USER_POOL_ID=<cognito user pool id>
REACT_APP_COGNITO_USER_POOL_WEB_CLIENT_ID=<cognito web client id>
REACT_APP_BE_HOST=qa-dubbz.com
REACT_APP_BE_HOST_HTTPS=true
BASE_FE_URL=https://qa-dubbz.com
TWITCH_CLIENT_ID=<twitch client id>
REACT_APP_APISDK_USE_APP=true

USDC_CONTRACT_ADDRESS=0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747
DUBBZ_MATCH_CONTRACT_ADDRESS=0x5c481e95c917537874129f8f40d8b4a99d770563
POLYGON_NETWORK_ID=80001
CHAIN_RPC=https://rpc-mumbai.maticvigil.com/
CHAIN_NAME='Polygon Mumbai'
CHAIN_CURRENCY_NAME='Matic Token'
CHAIN_CURRENCY_SYMBOL=MATIC
CHAIN_CURRENCY_DECIMALS=18
CHAIN_EXPLORER_URL=https://mumbai.polygonscan.com/
SENTRY=https://6996d0a1fea44f818c0da794db49cd6d@o1042857.ingest.sentry.io/4504327613251584
SECRET_HEADER=96d9d2dd-2dd6-4f41-a195-640484f2a579
```

The SECRET_HEADER is only needed for QA environment

The SENTRY listed here is the QA one, do not use it for prod builds.

BASE_FE_URL & TWITCH_CLIENT_ID are used in the twitch OAuth flow, if you are not going to use it, you can leave them empty
REACT_APP_APISDK_USE_APP is used by the APISDK to determine what to do in certain cases

You will need a .env.release file to deploy to PROD

### Releasing a new Android version

Google rejected our App, so now we have an APK for direct download in the site
The app is uploaded through the release process, the apk link is https://dubbz-prod-assets.s3.amazonaws.com/static/web/latest-build.apk
and you can get the latest uploaded build version in this link
https://dubbz-prod-assets.s3.amazonaws.com/static/web/apk-version.txt

In order to build a production version you will need to set the environment variables

`export KEYSTORE_PASSWORD=<keystore password>`
`export KEY_ALIAS=<key alias>`
`export KEY_PASSWORD=<key password>`

then run

`npm run prod`

and then in another session, inside the android directory run

`./gradlew bundleRelease`

### Releasing a new iOS version

In order to build a production version you will need run the following commands

`npm run prod`

And then archive from xcode and push it through xcode also

Please commit the last pushed version to this repository to keep it sync with what there is in the store

### Using precommit hook

Install dependencies locally. This will install the needed dev tools

`npm install`

Install the hooks

`npx husky install`

Then you are ready to go

If you want to skip this validations

`git commit -m "your message" --no-verify`

### Installing dependencies

To install the dependencies run

`npm install`

Make sure you are using the correct version of node, running `nvm use` in the root directory

### Starting the app deamon

To start the development server you need to run

`npx react-native start`

### Connecting to your android emulator

To connect the development server to your android emulator run

`npx react-native run-android`

### Connecting to your ios emulator

To connect the development server to your android emulator run

`npx react-native run-ios`

### Realoding the .env file

To reload the .env file you need to stop the server and then kill the server cache by running

`npx react-native start --reset-cache`

### Redux logic and other private packages

All of our redux logic is now maintained in another repository, https://github.com/duelme/apisdk.

All of our testing utilities / factories are maintained here: https://github.com/duelme/testing-library.

All of our constants are maintained here: https://github.com/duelme/js-constants.

If you need to make any changes to any of these repos, you should test the changes in your local environment first. To do so, use the [yalk](https://github.com/wclr/yalc) library.

Install `yalc` with `npm i yalc -g`.

Run `yalc publish` in the repo would like to test locally and then `yalc add <package-name>` (for example, `yalc add @duelme/testing-library`) in this repo. When you are finished with testing in your local environment, run `yalc remove <package-name>`.

### App versioning convention

App releases must be versioned in the format of x.y e.g (1.0, 1.1, 2.3, 10.12) i.e always must contain 1 decimal point and must be greater than the previous release.
