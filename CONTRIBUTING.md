# Contributing

Thank you for wanting to support __asch-js__ :)

## How to contribute

### Open an issue

Please open an issue and describe the work your about to begin. This reduces the chance of double work.  
Let the issue be assigned to you.

#### Follow commit message guidelines

Try to use the following commit message guideline: https://gist.github.com/stephenparish/9941e89d80e2bc58a153

### Create pull request for the `devevelop` channel

All our development work is happening on the `develop` branch.

Make sure that your code is formatted in the same way the previous code is written.

- Ensure tests pass through `npm run test`.
- Ensure the typescript definition file compiles `npm run test:typings`

#### Adjust the Typescript definition file (optional)

If you changed the API of the package be sure to reflect your changes in the `types/index.d.ts` file.

Be sure to lint the Typescript definition file `types/index.d.ts` with `dtslint types/`.  
Install dtslint: `npm install --global dtslint`

#### Provide Tests

If you fixed a bug or added a new feature be sure to provide a test in the `test/` directory.

### Submit your PR

Title your PR with a descriptive message. Point your Pull Request the `develop` channel.

### Update the Documentation (optional)

If you're pull request got accepted and the API of the package changed, be sure to document your change in [asch-docs/js_api/en.md](https://github.com/AschPlatform/asch-docs/blob/master/js_api/en.md)

### Thanks for your contribution! :)
