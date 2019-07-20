import { IPackage, IPackageAnswers } from '../models/node';

const buildPackage = (appName: string, answers: IPackageAnswers): IPackage => {
  return {
    name: appName,
    version: '1.0.0',
    description: answers.description,
    main: 'src/index.js',
    dependencies: {
      'ts-node': '^8.3.0',
      'typescript': '^3.5.2',
      'body-parser': '^1.19.0',
      'express': '^4.17.1',
      'shelljs': '^0.8.3'
    },
    devDependencies: {
      '@types/node': '^12.0.10',
      '@types/shelljs': '^0.8.5',
      '@types/express': '^4.17.0'
    },
    scripts: {
      'serve': 'npm run build && node dist/server.js',
      'build': 'npm run build-ts && npm run copy-static-assets',
      'build-ts': 'tsc --outDir dist',
      'copy-static-assets': 'ts-node copyStaticAssets.ts'
    },
    repository: {
      type: 'git',
      url: ''
    },
    author: answers.name,
    license: 'MIT'
  };
};

const buildLinter = (appName: string, answers: IPackageAnswers): any => {
  return {
    defaultSeverity: 'error',
    extends: ['tslint:recommended'],
    jsRules: {},
    rules: {
      'no-console': false,
      'quotemark': [true, 'single'],
      'no-var-requires': false,
      'resolveJsonModule': true,
      'esModuleInterop': true,
      'trailing-comma': false,
      'arrow-parens': false,
      'object-literal-sort-keys': false,
      'ordered-imports': false,
      'curly': false
    },
    rulesDirectory: []
  };
};

const buildJest = (appName: string, answers: IPackageAnswers): any => {
  return {};
};

const filesToBuild = [
  { name: 'package.json', content: buildPackage },
  { name: 'tslint.json', content: buildLinter },
  { name: 'jest.config.js', content: buildJest }
];

export { filesToBuild };
