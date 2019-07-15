import chalk from 'chalk';
import * as fs from 'fs';
import { filesToBuild } from './package';
import { Question } from 'inquirer';

const currentDir: string = process.cwd();
const errorLog: (message: string | any) => void = chalk.red.inverse;
const successLog: (message: string) => void = chalk.green.bold;

const inqQuestions: Question[] = [
  {
    type: 'input',
    name: 'Description',
    message: 'Describe your project',
    default: ''
  },
  {
    type: 'input',
    name: 'Name',
    message: `What is the author's name?`,
    default: ''
  }
];

const srcChildren = ['config', 'controllers', 'models', 'public', 'types'];
let consolesToLog: string[] = [];

/**
 * Function to successively create the directory structure for the application
 */
function bootstrap(appName: string, answers?: any): void {
  createRoot(appName)
    .then((success: boolean) => {
      consolesToLog.push(`${successLog('CREATED')}: ${appName}/`);
      if (success) {
        createSrc(appName).catch(err => {
          consolesToLog = [`${errorLog('ERROR')}: ${err}`];
          deleteDir(appName, 'src');
        });
        createDir(appName, 'tests')
          .then((success: boolean) => {
            consolesToLog.push(`${successLog('CREATED')}: ${appName}/tests`);
          })
          .catch(err => {
            consolesToLog = [`${errorLog('ERROR')}: ${err}`];
            deleteDir(appName, 'tests');
          });
        filesToBuild.forEach(file => {
          createJSONFile(appName, file.name, file.content)
            .then(data => {
              consolesToLog.push(`${successLog('CREATED')}: ${data}`);
            })
            .catch(err => {
              consolesToLog = [`${errorLog('ERROR')}: ${err}`];
              deleteFile(appName, file.name);
            });
        });
      }
    })
    .catch(err => {
      consolesToLog = [`${errorLog('ERROR')}: ${err}`];
      deleteDir('', appName);
    })
    .finally(() => {
      consolesToLog.forEach(consoleLog => {
        console.log(consoleLog);
      });
    });
}

/**
 * Create root folder for the Node.ts API
 * @param appName name of application root folder
 */
const createRoot = (appName: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(appName)) {
      fs.mkdir(appName, null, err => {
        if (err) return reject(err);
        resolve(true);
      });
    } else {
      return reject(`${appName}/ already exists in ${currentDir}`);
    }
  });
};

/**
 * Deletes directory if any actions are unsuccessful
 * @param appName name application root
 * @param directoryName name of directory to delete
 */
const deleteDir = (path: string, directory: string): void => {
  fs.rmdir(`./${path}/${directory}`, err => {
    if (err)
      consolesToLog = [
        `${errorLog(
          'ERROR'
        )}: Could not delete directory ${path}/${directory}: ${err}`
      ];
  });
};

/**
 * Function that creates directories
 * Returns a Promise<boolean> to indicate whether success and to continue...
 * @param appName The name passed to the create command
 * @param dryRun optional command argument to run command as test only
 */
const createDir = (
  appName?: string,
  directoryName?: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    fs.mkdir(`./${appName}/${directoryName}`, null, err => {
      if (err) return reject(err);
      resolve(true);
    });
  });
};

/**
 * Function to delete files
 * @param appName name application root
 * @param fileName name of file to delete
 */
const deleteFile = (appName: string, fileName: string): void => {
  fs.unlink(`./${appName}/${fileName}`, err => {
    if (err)
      consolesToLog = [
        `${errorLog(
          'ERROR'
        )}: Could not delete file ${appName}/${fileName}: ${err}`
      ];
  });
};

/**
 * Generic-ish function to create .json files, returns a promise
 * when file has been created or an error occurs.
 * @param path path to create the jsonfiles
 * @param fileName name of json file to be created
 * @param fileFunc function to return the specific json object
 * @param config optional parameter if function is a tsconfig file
 */
const createJSONFile = (
  appName: string,
  fileName: string,
  fileFunc: any
): Promise<any> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      `./${appName}/${fileName}`,
      JSON.stringify(fileFunc(appName), null, '\t'),
      err => {
        if (err) reject(err);
        resolve(`${appName}/${fileName}`);
      }
    );
  });
};

/**
 * Create the source directory and all the child dir and files
 * @param appName name application root
 * @param directory name
 */
const createSrc = (appName: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    createDir(appName, 'src').then((success: boolean) => {
      console.log(`${successLog('CREATED')}: ${appName}/src`);
      srcChildren.forEach(dir => {
        createDir(`${appName}/src`, dir)
          .then(() => {
            consolesToLog.push(
              `${successLog('CREATED')}: ${appName}/src/${dir}`
            );
          })
          .catch(err => {
            reject(err);
          });
      });
      fs.writeFile(`./${appName}/src/server.ts`, null, err => {
        if (err) reject(err);
        consolesToLog.push(
          `${successLog('CREATED')}: ${appName}/src/server.ts`
        );
        resolve(true);
      });
    });
  });
};

export { bootstrap, inqQuestions };
