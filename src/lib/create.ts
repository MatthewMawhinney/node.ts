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
      await Promise.all([
        createDir(appName, 'src'),
        createDir(appName, 'tests'),
        createFile(appName, 'dist/ \n node_modules/ \n .env', '.gitignore'),
        createFile(appName, '', '.env'),
        createChildrenDir(`${appName}/src`, srcChildren),
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
const createRootDir = (appName: string): Promise<string> => {
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
const createChildrenDir = (
  parentDirPath: string,
  dirToCreate: string[]
): Promise<string[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const consoles: string[] = await processDirectoryArray(
        parentDirPath,
        dirToCreate
      );
      resolve(consoles);
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Function to create directories from array of strings
 * @param path location to create directories inside
 * @param array array of dir names
 */
const processDirectoryArray = async (
  path: string,
  array: any[]
): Promise<string[]> => {
  const promises = array.map((dir: string) => createDir(path, dir));
  return await Promise.all(promises);
};

/**
 * Function to create root JSON files eg. Package.json, Jest.config.js...
 * @param path path to parent directory
 * @param files array of @IBuildFile to create files from
 * @param answers answers from inquirer to populate package.json with
 */
const createRootFiles = (
  path: string,
  files: IBuildFile[],
  answers: IPackageAnswers
): Promise<string[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const consoles: string[] = await processJSONFileArray(
        path,
        files,
        answers
      );
      resolve(consoles);
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Function used to create multiple JSON files at once
 * @param path location to create files in
 * @param array array of files to build
 * @param answers answers used to populate files
 */
const processJSONFileArray = async (
  path: string,
  array: any[],
  answers: IPackageAnswers
): Promise<string[]> => {
  const promises = array.map((file: IBuildFile) =>
    createJSONFile(path, file.name, file.content, answers)
  );
  return await Promise.all(promises);
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
  fileFunc: (file: string, answers: IPackageAnswers) => any,
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
const createFile = (
  path: string,
  content: string | {},
  fileName: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(`./${path}/${fileName}`, content, err => {
      if (err) reject(err);
      resolve(`${path}/${fileName}`);
    });
  });
};

/**
 * Deletes directory if any actions are unsuccessful
 * @param appName name application root
 * @param directoryName name of directory to delete
 */
const deleteDir = (path: string, directory: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.rmdir(`./${path}/${directory}`, err => {
      if (err) reject(err);
      resolve(`${path}/${directory}`);
    });
  });
};

/**
 * Function to delete files
 * @param appName name application root
 * @param fileName name of file to delete
 */
const deleteFile = (path: string, fileName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.unlink(`./${path}/${fileName}`, err => {
      if (err) reject(err);
      resolve(`${path}/${fileName}`);
    });
  });
};

export { bootstrap, createRootDir, inqQuestions };
