import { IPackage, IPackageAnswers } from '../models/node';

const buildPackage = (appName: string, answers: IPackageAnswers): IPackage => {
  return {
    name: appName,
    version: '1.0.0',
    description: answers.description,
    dependencies: {
      'body-parser': '^1.19.0',
      'express': '^4.17.1',
      'shelljs': '^0.8.3'
    },
    devDependencies: {
      '@types/node': '^12.0.10',
      '@types/shelljs': '^0.8.5',
      '@types/express': '^4.17.0',
      '@types/jest': '^24.0.15',
      'ts-jest': '^24.0.2',
      'ts-node': '^8.3.0',
      'typescript': '^3.5.2',
      'jest': '^24.8.0'
    },
    scripts: {
      'serve': 'npm run build && node dist/server.js',
      'build': 'rm -rf dist && tsc && npm run copy-static-assets',
      'copy-static-assets': 'ts-node staticAssets.ts',
      'test': 'jest'
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

const filesToBuild = [{ name: 'package.json', content: buildPackage }, { name: 'tslint.json', content: buildLinter }];

export { filesToBuild };
