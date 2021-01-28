# Boomerang Flow Lifecycle Worker

This is the Boomerang Flow Lifecycle Worker that runs as init and sidecar container for the Custom Flow Task or Bring Your Own container task in Flow.

Depends on:

- [Boomerang Flow Worker](https://github.com/boomerang-io/worker.flow)
- [Boomerang Worker CLI](https://github.com/boomerang-io/worker.interfaces)
- [Boomerang Worker Core](https://github.com/boomerang-io/worker.interfaces)

## Packaging

### CICD

This project is built, tested, and packaged via the Boomerang CICD system hosted and provided by IBM.

### Manual

`VERSION=1.1.0 && docker build -t boomerangio/worker-lifecycle:$VERSION . && docker push boomerangio/worker-lifecycle:$VERSION`

## Available Scripts

### `npm run dev`

Execute `boomerang-worker-cli` in local mode. Used for local development.

### `npm run dev:debug`

Execute `boomerang-worker-cli` in local and debug mode

### `npm run format`

Format your code with [Prettier](https://prettier.io/)

### `npm run lint`

Lint your `.js` files with [ESLint](https://eslint.org/)

### `npm start`

Execute `boomerang-worker-cli`. Used for execution in worker environment. There are assumptions made about files and directories available.

### `npm run test`

Execute unit tests with [Jest](https://jestjs.io/)

### `npm run test:coverage`

Execute unit tests with [Jest](https://jestjs.io/) and generate coverage report

## Testing

[Jest](https://jestjs.io/) is included as a test runner with scripts to execute unit tests and generate code coverage reports.

## Project Configuration

The template includes configuration for the following:

- Code Formatting via [Prettier](https://prettier.io/)
- Linting via [ESLint](https://eslint.org/)
- Precommit hooks via [Husky](https://github.com/typicode/husky)
- Commit standards via [Commitlint](https://github.com/conventional-changelog/commitlint) (not configured by default, but recommended)

Enable commit standards via [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.4/) by adding the following to your `package.json`.

```js
"husky": {
    "hooks": {
      "commit-msg": "commitlint -e $HUSKY_GIT_PARAMS",
    }
  }
```

## Troubleshooting

- Make sure that your `commands` directory only includes `.js` files that export modules. The CLI will try to register every matching file in it.
