import { IPackage, IPackageAnswers } from '../models/node';

const filesToBuild = [
  { name: 'package.json', content: buildPackage },
  { name: 'tslint.json', content: buildLinter },
  { name: 'jest.config.js', content: buildJest }
];

function buildPackage(appName: string, answers: IPackageAnswers): IPackage {
  return {
    name: appName,
    version: '1.0.0',
    description: answers.description,
    main: 'src/index.js',
    dependencies: {
      'ts-node': '^8.3.0',
      typescript: '^3.5.2'
    },
    devDependencies: {
      '@types/node': '^12.0.10'
    },
    scripts: {
      build: 'tsc --outDir dist'
    },
    author: answers.name,
    license: 'MIT'
  };
}

function buildLinter(appName: string, answers: string[]): any {
  return {
    defaultSeverity: 'error',
    extends: ['tslint:recommended'],
    jsRules: {},
    rules: {
      quotemark: [true, 'single']
    },
    rulesDirectory: []
  };
}

function buildJest(appName: string, answers: string[]): any {
  return {};
}

export { filesToBuild };
