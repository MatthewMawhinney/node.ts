![alt-text](./src/assets/node-ts.png)

A Node CLI for generating Node.js API using Typescript and Express.

This project was created as practice for creating Node CLIs, working with Node/Typescript, as well as Promises and Async/await.

## :package: Getting Started

At this stage Node.ts is not meant to be used as a production development tool, but if you find it useful for your projects I would love to hear about it, If you feel like contributing to the project, by all means fork the repo and make a pull request with any enhancements or bug fixes, I'm sure there are plenty.

### :electric_plug: Installing

Node.ts is available as a npm package. To install globally run:

```
npm install -g node.ts
```

That's it! If globally installed, Node.ts will create your new project in the current directory of your terminal.

### :file_folder: File Structure

The structure of the project is loosely based off of [Microsoft's Typscript + Node](https://github.com/Microsoft/TypeScript-Node-Starter#typescript-node-starter) starter project structure.
Below is the output of creating a new Node.ts project:

| Name                | Description                                                                                   |
| ------------------- | --------------------------------------------------------------------------------------------- |
| **dist**            | Contains the distributable (or output) from your TypeScript build. This is the code you ship  |
| **node_modules**    | Contains all your npm dependencies                                                            |
| **src**             | Contains your source code that will be compiled to the dist dir                               |
| **src/config**      | Passport authentication strategies and login middleware. Add other complex config code here   |
| **src/controllers** | Controllers define functions that respond to various http requests                            |
| **src/models**      | Models define Mongoose schemas that will be used in storing and retrieving data from MongoDB  |
| **src/public**      | Static assets that will be used client side                                                   |
| **src/types**       | Holds .d.ts files not found on DefinitelyTyped.                                               |
| **src**/app.ts      | Handler for your routes/controllers                                                           |
| **src**/server.ts   | Entry point to your express app                                                               |
| **\_\_tests\_\_**   | Contains your tests. Separate from source because there is a different build process.         |
| .env                | API keys, tokens, passwords, database URI. Clone this, but don't check it in to public repos. |
| .gitignore          | Gitignore file, containing dist, node_modules, and env by default                             |
| jest.config.js      | Used to configure Jest running tests written in TypeScript                                    |
| package.json        | File that contains npm dependencies.                                                          |
| staticAssets.ts     | Build script that copies images, fonts, and JS libs to the dist folder                        |
| tsconfig.json       | Config settings for compiling server code written in TypeScript                               |
| tslint.json         | Config settings for TSLint code style checking                                                |

## :hammer: Commands

##### Create a new Node.ts project:

```
node.ts new/n <projectName>
```

You will be asked a few simple questions, after which, the project will be created in a directory of the same name, a tsconfig.json, package.json, package-lock.json, jest.config.js, and tslint.json will be built. Git will be initiaized locally and a initial commit will be completed with your new project structure. Afterwards the dependencies will be downloaded.

---

## :clipboard: v0.2.0 and Beyond

- Fixing the many bugs that will arise...
- Add command to create new models/controllers through the CLI
- Unit testing
- More boilerplate files in new projects, to speed up development
- CLI Option to create Node.ts CLI application rather than API Server

For any other suggestions, or requests, either post an issue, or feel free to add yourself!

## :lock: License

This project is licensed under the MIT License.
