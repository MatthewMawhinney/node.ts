import * as fs from 'fs';

import { filesToBuild } from './package';
import { IBuildFile, IPackageAnswers } from '../models/node';
import { Question } from 'inquirer';

const currentDir: string = process.cwd();

const inqQuestions: Question[] = [
  {
    type: 'input',
    name: 'name',
    message: `What is the author's name?`,
    default: ''
  },
  {
    type: 'input',
    name: 'description',
    message: 'Describe your project',
    default: 'Node.js API with Typescript'
  }
];

const srcChildren = ['config', 'controllers', 'models', 'public', 'types'];

const bootstrap = (
  appName: string,
  answers: IPackageAnswers
): Promise<string[]> => {
  return new Promise(async (resolve, reject) => {
    const consoles: string[] = [];
    try {
      consoles.push(await createRoot(appName));
      await Promise.all([
        createSrc(appName),
        createDir(appName, 'tests'),
        createRootFiles(appName, filesToBuild, answers)
      ]).then(response => {
        response.forEach((results: string[] | string) => {
          if (typeof results === 'string') {
            consoles.push(results);
          } else {
            results.forEach((result: string) => {
              consoles.push(result);
            });
          }
        });
      });
      resolve(consoles);
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Create root folder for the Node.ts API
 * @param appName name of application root folder
 */
const createRoot = (appName: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!fs.existsSync(appName)) {
        resolve(await createDir(appName));
      } else {
        reject(`${appName}/ already exists in ${currentDir}`);
      }
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Create the source directory and all the child dir and files
 * @param appName name application root
 * @param directory name
 */
const createSrc = (appName: string): Promise<string[]> => {
  return new Promise(async (resolve, reject) => {
    let consoles: string[] = [];
    try {
      consoles.push(await createDir(appName, 'src'));
      srcChildren.forEach(async dir => {
        consoles.push(await createDir(`${appName}/src`, dir));
      });
      consoles.push(await createFile(`${appName}/src`, 'server.ts'));
      resolve(consoles);
    } catch (err) {
      reject(err);
    }
  });
};

const createRootFiles = (
  path: string,
  files: IBuildFile[],
  answers: IPackageAnswers
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    let consoles: string[] = [];
    try {
      files.forEach(async (file: IBuildFile) => {
        consoles.push(
          await createJSONFile(path, file.name, file.content, answers)
        );
      });
      console.log(consoles);
      resolve(consoles);
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Function that creates directories
 * Returns a Promise<boolean> to indicate whether success and to continue...
 * @param appName The name passed to the create command
 * @param dryRun optional command argument to run command as test only
 */
const createDir = (path: string, directoryName?: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    let filePath: string;
    if (directoryName) {
      filePath = `${path}/${directoryName}`;
    } else {
      filePath = `${path}`;
    }
    fs.mkdir(`./${filePath}`, null, err => {
      if (err) return reject(err);
      resolve(filePath);
    });
  });
};

/**
 * Function to create individual files
 * @param path path to location for file
 * @param fileName name of file to be created at @path
 */
const createFile = (path: string, fileName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(`./${path}/${fileName}`, null, err => {
      if (err) reject(err);
      resolve(`${path}/${fileName}`);
    });
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
  filePath: string,
  fileName: string,
  fileFunc: Function,
  answers: IPackageAnswers
): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      `./${filePath}/${fileName}`,
      JSON.stringify(fileFunc(filePath, answers), null, '\t'),
      err => {
        if (err) reject(err);
        resolve(`${filePath}/${fileName}`);
      }
    );
  });
};

/**
 * Deletes directory if any actions are unsuccessful
 * @param appName name application root
 * @param directoryName name of directory to delete
 */
// const deleteDir = (path: string, directory: string): void => {
//   fs.rmdir(`./${path}/${directory}`, err => {
//     if (err)
//       consolesToLog = [
//         `${errorLog(
//           'ERROR'
//         )}: Could not delete directory ${path}/${directory}: ${err}`
//       ];
//   });
// };

/**
 * Function to delete files
 * @param appName name application root
 * @param fileName name of file to delete
 */
// const deleteFile = (path: string, fileName: string): void => {
//   fs.unlink(`./${path}/${fileName}`, err => {
//     if (err)
//       consolesToLog = [
//         `${errorLog(
//           'ERROR'
//         )}: Could not delete file ${path}/${fileName}: ${err}`
//       ];
//   });
// };

export { bootstrap, inqQuestions };
