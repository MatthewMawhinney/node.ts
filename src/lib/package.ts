import { IPackage, ITSconfig } from '../models/node';

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

function buildConfig(appName: string, config: boolean): any | ITSconfig {
  if (config) {
    return {
      compilerOptions: {
        target: 'es5',
        module: 'commonjs',
        outDir: './dist',
        strict: true
      }
    };
  } else {
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
}

export { buildPackage, buildConfig };
