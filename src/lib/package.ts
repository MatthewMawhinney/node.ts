import { IPackage, ITSconfig } from '../models/node';

const filesToBuild = [
  { name: 'package.json', content: buildPackage },
  { name: 'tslint.json', content: buildLinter },
  { name: 'tsconfig.json', content: buildConfig },
  { name: 'jest.config.js', content: buildJest }
];

function buildPackage(appName: string): IPackage {
  return {
    name: appName,
    version: '1.0.0',
    description: '',
    main: 'index.js',
    dependencies: {},
    devDependencies: {},
    scripts: {},
    author: '',
    license: ''
  };
}

function buildConfig(appName: string): ITSconfig {
  return {
    compilerOptions: {
      target: 'es5',
      module: 'commonjs',
      outDir: './dist',
      strict: true
    }
  };
}

function buildLinter(appName: string): any {
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

function buildJest(): any {
  return {};
}

export { filesToBuild };
