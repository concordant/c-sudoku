# C - Sudoku

[![License](https://img.shields.io/badge/license-MIT-green)](https://opensource.org/licenses/MIT)

Sudoku using the Concordant platform API.

## Setup guide

0.**Requirements**

For the next steps, you will need the following software:

- Make sure you have the latest version of Node.js: [see official installation guide](https://nodejs.org/en/download/);
- The project uses Git to download some required dependencies: [follow the official install guide](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

For the moment, we are using a private scoped package of CRDT.

For that purpose, we need to [create a deploy token](https://docs.gitlab.com/ee/user/project/deploy_tokens/) in concordant/Software/c-crdtlib.

Then use the following command to configure our npm client to use our organization's scope:
```
$ npm config set @concordant:registry "https://gitlab.inria.fr/api/v4/packages/npm/"
$ npm config set '//gitlab.inria.fr/api/v4/packages/npm/:_authToken' "<deployToken>"
```

1.**Install Project dependencies**

Go to project root directory and:

```shell
npm install
```

2.**Run the application**

```shell
npm start
```

## Requirements (versions)

Node: v14.15.0+
NPM: v6.14.8+

(Project might work with older Node and NPM versions)
