import chalk from 'chalk';
import * as fs from 'fs';

const currentDir: string = process.cwd();
const errorLog: (message: string) => void = chalk.red.inverse;
const successLog: (message: string) => void = chalk.green.bold;

/**
 * Create parent directory in current directory,
 * Only create if it does not currently exist, if it does,
 * throw an error and exit function.
 */
function createParent(appName: string, dryRun?: boolean): void {
  if (!fs.existsSync(appName)) {
    if (!dryRun) {
      fs.mkdirSync(appName, { recursive: true });
    }
    console.log(`${successLog('CREATED')}: ${appName}/`);
  } else {
    console.log(
      `${errorLog('ERROR!')}: ${appName}/ already exists in ${currentDir}}`
    );
    return;
  }
  createSourceTests(appName, dryRun);
}

function createSourceTests(appName: string, dryRun?: boolean): void {
  fs.mkdir(`${appName}/src`, err => {
    if (err) {
      throw err;
    }
    console.log(`${successLog('CREATED')}: ${appName}/src`);
    createPackage(appName);
  });
  fs.mkdir(`${appName}/__tests__`, err => {
    if (err) {
      throw err;
    }
    console.log(`${successLog('CREATED')}: ${appName}/__tests__`);
  });
}

function createPackage(appName: string): void {
  fs.writeFile(`${appName}/package.json`, `{"name": "${appName}"}`, err => {
    if (err) {
      throw err;
    }
    console.log(`${successLog('CREATED')}: ${appName}/package.json`);
  });
}

export = createParent;
