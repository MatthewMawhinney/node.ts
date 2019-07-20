# Node.ts

A Node CLI for generating Node.js API using Typescript and Express

A simple CLI built to help quickly bootstrap Node.ts projects.
This project was created as practice for creating Node CLIs, working with Node/Typescript, as well as Promises and Async/await.
By no means is this meant to be a super useful development tool, but if you find it useful for your projects I would love to hear about it,
If you feel like contributing to the project, by all means fork the repo and make a pull request with any enhancements.

The structure of the project is loosely based off of [Microsoft's Typscript + Node](https://github.com/Microsoft/TypeScript-Node-Starter#typescript-node-starter) starter project structure.

## node-ts new _appName_

Creates new project in your current directory with the passed in _appName_.
Below is the output of creating a new Node.ts project:

| Name                | Description                                                                                   |
| ------------------- | --------------------------------------------------------------------------------------------- |
| **.vscode**         | Contains VS Code specific settings                                                            |
| **dist**            | Contains the distributable (or output) from your TypeScript build. This is the code you ship  |
| **node_modules**    | Contains all your npm dependencies                                                            |
| **src**             | Contains your source code that will be compiled to the dist dir                               |
| **src/config**      | Passport authentication strategies and login middleware. Add other complex config code here   |
| **src/controllers** | Controllers define functions that respond to various http requests                            |
| **src/models**      | Models define Mongoose schemas that will be used in storing and retrieving data from MongoDB  |
| **src/public**      | Static assets that will be used client side                                                   |
| **src/types**       | Holds .d.ts files not found on DefinitelyTyped.                                               |
| **src**/server.ts   | Entry point to your express app                                                               |
| **tests**           | Contains your tests. Separate from source because there is a different build process.         |
| .gitignore          | Gitignore file, containing dist, node_modules, and env by default                             |
| .env                | API keys, tokens, passwords, database URI. Clone this, but don't check it in to public repos. |
| copyStaticAssets.ts | Build script that copies images, fonts, and JS libs to the dist folder                        |
| jest.config.js      | Used to configure Jest running tests written in TypeScript                                    |
| package.json        | File that contains npm dependencies.                                                          |
| tsconfig.json       | Config settings for compiling server code written in TypeScript                               |
| tslint.json         | Config settings for TSLint code style checking                                                |
