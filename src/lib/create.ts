import chalk from 'chalk';
import * as fs from 'fs';
import { buildPackage, buildConfig } from './package';

const currentDir: string = process.cwd();
const errorLog: (message: string) => void = chalk.red.inverse;
const successLog: (message: string) => void = chalk.green.bold;

/**
 * Create parent directory in current directory,
 * Only create if it does not currently exist, if it does,
 * throw an error and exit function.
 */
function bootstrap(appName: string, dryRun?: boolean): void {
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
  createSourceTests(appName, dryRun).then((success: boolean) => {
    if (success) {
      fs.writeFile(`${appName}/.gitignore`, '', err => {
        if (err) {
          throw err;
        }
        console.log(`${successLog('CREATED')}: ${appName}/.gitignore`);
      });
      createJSONFile(appName, 'package.json', buildPackage).then(data => {
        console.log(data);
      });
      createJSONFile(appName, 'tslint.json', buildConfig, false).then(data => {
        console.log(data);
      });
      createJSONFile(appName, 'tsconfig.json', buildConfig, true).then(data => {
        console.log(data);
      });
      createJSONFile(appName, 'jest.config', {}).then(data => {
        console.log(data);
      });
    }
  });
}

/**
 * Function that creates the src and __tests__ folder inside the root appName
 * Returns a Promise<boolean> to indicate whether success and to continue...
 * @param appName The name passed to the create command
 * @param dryRun optional command argument to run command as test only
 */
function createSourceTests(
  appName: string,
  dryRun?: boolean
): Promise<boolean> {
  if (!dryRun) {
    fs.mkdirSync(`${appName}/__tests__`);
    fs.mkdirSync(`${appName}/src`);
  }
  console.log(`${successLog('CREATED')}: ${appName}/__tests__`);
  console.log(`${successLog('CREATED')}: ${appName}/src`);
  return Promise.resolve(true);
}

/**
 * Generic-ish function to create .json files, returns a promise
 * when file has been created or an error occurs.
 * @param path path to create the jsonfiles
 * @param fileName name of json file to be created
 * @param fileFunc function to return the specific json object
 * @param config optional parameter if function is a tsconfig file
 */
function createJSONFile(
  path: string,
  fileName: string,
  fileFunc: any,
  config?: boolean
): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      `${path}/${fileName}`,
      JSON.stringify(fileFunc(path, config), null, '\t'),
      err => {
        if (err) {
          reject(err);
        } else {
          resolve(`${successLog('CREATED')}: ${path}/${fileName}`);
        }
      }
    );
  });
}

export = bootstrap;
